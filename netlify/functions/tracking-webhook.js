import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountStr) {
      const serviceAccount = JSON.parse(serviceAccountStr);
      initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT is not set. Webhook will fail to update Firestore.");
    }
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", error);
  }
}

export const handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // 1. Security Check
    const apiKey = event.headers['x-api-key'] || event.headers['X-Api-Key'];
    const expectedKey = process.env.SHIPROCKET_WEBHOOK_SECRET;

    if (!expectedKey) {
      console.error("SHIPROCKET_WEBHOOK_SECRET is not configured in Netlify.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    if (apiKey !== expectedKey) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    // 2. Parse Payload
    const payload = JSON.parse(event.body || "{}");
    console.log("Received Webhook Payload:", JSON.stringify(payload));

    const awb = payload.awb || payload.awb_code;
    const shipmentId = payload.shipment_id;
    const currentStatus = payload.current_status || payload.status;

    if (!awb && !shipmentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing AWB or Shipment ID in payload' })
      };
    }

    // 3. Status Mapping
    let newStatus = null;
    const lowerStatus = (currentStatus || "").toLowerCase();

    if (lowerStatus.includes('manifested') || lowerStatus.includes('pickup scheduled')) {
      newStatus = 'Packed';
    } else if (lowerStatus.includes('picked up')) {
      newStatus = 'Picked Up';
    } else if (lowerStatus.includes('in transit')) {
      newStatus = 'In Transit';
    } else if (lowerStatus.includes('out for delivery')) {
      newStatus = 'Out For Delivery';
    } else if (lowerStatus.includes('delivered')) {
      newStatus = 'Delivered';
    }

    if (!newStatus) {
      // Unmapped status, return 200 so Shiprocket doesn't retry, but log it
      console.log(`Unmapped status received: ${currentStatus}. Ignoring.`);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Status ignored' })
      };
    }

    // 4. Find and Update Firestore
    const db = getFirestore();
    const ordersRef = db.collection('orders');
    let querySnapshot;

    if (awb) {
      querySnapshot = await ordersRef.where('awbCode', '==', String(awb)).limit(1).get();
    }
    
    if ((!querySnapshot || querySnapshot.empty) && shipmentId) {
      querySnapshot = await ordersRef.where('shiprocketShipmentId', '==', String(shipmentId)).limit(1).get();
    }

    if (!querySnapshot || querySnapshot.empty) {
      console.warn(`Order not found for AWB: ${awb} or ShipmentId: ${shipmentId}`);
      return {
        statusCode: 200, // Return 200 to prevent retries for non-existent orders
        body: JSON.stringify({ message: 'Order not found, ignored.' })
      };
    }

    const orderDoc = querySnapshot.docs[0];
    const updateData = {
      shipmentStatus: newStatus,
      updatedAt: FieldValue.serverTimestamp()
    };

    if (newStatus === 'Delivered') {
      updateData.deliveredAt = FieldValue.serverTimestamp();
      updateData.status = 'delivered'; // Update the main status field as well
    }

    // Attempt to parse estimated delivery date if provided
    if (payload.etd) {
      try {
        updateData.estimatedDeliveryDate = new Date(payload.etd);
      } catch (e) {
        console.error("Invalid ETD date format:", payload.etd);
      }
    }

    await orderDoc.ref.update(updateData);
    console.log(`Successfully updated order ${orderDoc.id} to status ${newStatus}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' })
    };

  } catch (error) {
    console.error("Webhook processing error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
