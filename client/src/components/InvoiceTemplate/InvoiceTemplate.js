import React from 'react';
import './InvoiceTemplate.css';

const InvoiceTemplate = ({ invoice }) => {
  if (!invoice) {
    return null;
  }

  const renderSmartFields = (item) => {
    const fields = [];
    if (item.type === 'Mobile Phone') {
      if (item.model) fields.push(<p key="model"><strong>Model:</strong> {item.model}</p>);
      if (item.imei) fields.push(<p key="imei"><strong>IMEI:</strong> {item.imei}</p>);
      if (item.ram) fields.push(<p key="ram"><strong>RAM:</strong> {item.ram}</p>);
      if (item.storage) fields.push(<p key="storage"><strong>Storage:</strong> {item.storage}</p>);
    } else if (item.type === 'Laptop') {
      if (item.model) fields.push(<p key="model"><strong>Model:</strong> {item.model}</p>);
      if (item.serialNumber) fields.push(<p key="serialNumber"><strong>Serial Number:</strong> {item.serialNumber}</p>);
      if (item.processor) fields.push(<p key="processor"><strong>Processor:</strong> {item.processor}</p>);
      if (item.ram) fields.push(<p key="ram"><strong>RAM:</strong> {item.ram}</p>);
      if (item.storage) fields.push(<p key="storage"><strong>Storage:</strong> {item.storage}</p>);
    }
    return <div className="smart-fields">{fields}</div>;
  };

  return (
    <div className="invoice-template">
      <header>
        <h1>Invoice</h1>
        <div className="company-info">
          {/* Company info can be fetched from settings context if available */}
          <p><strong>Invoice Pro</strong></p>
        </div>
      </header>
      <main>
        <div className="invoice-details">
          <p><strong>Invoice ID:</strong> {invoice.id}</p>
          <p><strong>Customer:</strong> {invoice.customerName}</p>
          <p><strong>Email:</strong> {invoice.customerEmail}</p>
          <p><strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
        <table className="invoice-items">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <p className="item-name">{item.name}</p>
                  {renderSmartFields(item)}
                </td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="invoice-summary">
          <p><strong>Subtotal:</strong> ${invoice.subtotal.toFixed(2)}</p>
          <p><strong>Total:</strong> ${invoice.total.toFixed(2)}</p>
        </div>
        <div className="sales-info">
          <p><strong>Sold By:</strong> {invoice.soldBy}</p>
          <p><strong>Sales Channel:</strong> {invoice.salesChannel}</p>
        </div>
      </main>
      <footer>
        <p>Thank you for your business!</p>
      </footer>
    </div>
  );
};

export default InvoiceTemplate;
