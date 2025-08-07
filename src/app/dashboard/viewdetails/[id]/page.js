export default async function OrderDetailsPage({ params }) {
  const { id } = await params;

  const request = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/confirm/order?orderId=${id}`
  );
  const response = await request.json();

  const order = response;

  return (
    <div className="px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Order Details</h1>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Order Info</h2>
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Note:</strong> {order.note}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Customer Info</h2>
          <p>
            <strong>Name:</strong> {order.user.name}
          </p>
          <p>
            <strong>Email:</strong> {order.user.email}
          </p>
          <p>
            <strong>Phone:</strong> {order.user.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.user.address}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        <div className="space-y-4">
          {order.products.map((product) => (
            <div
              key={product.productId}
              className="flex gap-4 items-center border-b pb-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded object-cover"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p>Qty: {product.quantity}</p>
                <p>
                  Color: {product.color} | Size: {product.size}
                </p>
                <p>
                  Price: ৳{product.price} | MRP: <s>৳{product.mrp}</s>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="bg-white p-4 rounded shadow w-[30%]">
          <h2 className="text-lg font-semibold mb-2">Payment Info</h2>
          <p>
            <strong>Method:</strong> {order.payment.method}
          </p>
          <p>
            <strong>Status:</strong> {order.payment.status}
          </p>
          {order.payment.transactionId && (
            <p>
              <strong>Transaction ID:</strong> {order.payment.transactionId}
            </p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow w-[30%]">
          <h2 className="text-lg font-semibold mb-2">Amount Summary</h2>
          <p>
            <strong>Total:</strong> ৳{order.totalAmount}
          </p>
          <p>
            <strong>Discount:</strong> ৳{order.discount}
          </p>
          <p>
            <strong>Delivery Charge:</strong> ৳{order.deliveryCharge}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow w-[40%]">
          <h2 className="text-lg font-semibold mb-2">Status History</h2>
          {Object.entries(order.statusHistory).map(
            ([key, value]) =>
              value && (
                <p key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  {new Date(value).toLocaleString()}
                </p>
              )
          )}
        </div>
      </div>
    </div>
  );
}
