import React, { useState, useEffect, useContext, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebaseClient';
import { collection, getDocs, addDoc, doc, getDoc, query, where } from 'firebase/firestore';
import './CreateInvoicePage.css';

const CreateInvoicePage = () => {
  const { currentUser } = useContext(AuthContext);
  const sigCanvas = useRef({});
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState({
    issueDate: '',
    dueDate: '',
  });
  const [items, setItems] = useState([]);
  const [itemType, setItemType] = useState('Generic Item');
  const [salesInfo, setSalesInfo] = useState({
    soldBy: '',
    salesChannel: '',
  });
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [defaultSignatureUrl, setDefaultSignatureUrl] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'customers'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const customersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(customersData);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    if (currentUser) {
      fetchCustomers();
    }
  }, [currentUser]);

  useEffect(() => {
    const newSubtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal); // For now, total is the same as subtotal
  }, [items]);

  const handleItemChange = (index, event) => {
    const newItems = [...items];
    newItems[index][event.target.name] = event.target.value;
    setItems(newItems);
  };

  const addItem = () => {
    let newItem;
    switch (itemType) {
      case 'Mobile Phone':
        newItem = { type: 'Mobile Phone', model: '', ram: '', storage: '', color: '', imei: '', quantity: 1, price: 0 };
        break;
      case 'Laptop / Chromebook':
        newItem = { type: 'Laptop / Chromebook', model: '', processor: '', ram: '', storage: '', serialNo: '', quantity: 1, price: 0 };
        break;
      case 'Apparel / Clothing':
        newItem = { type: 'Apparel / Clothing', item: '', size: '', color: '', material: '', quantity: 1, price: 0 };
        break;
      default:
        newItem = { type: 'Generic Item', description: '', quantity: 1, price: 0 };
    }
    setItems([...items, newItem]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSaveInvoice = async () => {
    if (!currentUser) return;
    try {
      const customer = customers.find(c => c.id === selectedCustomer);
      let signatureDataURL = '';
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        signatureDataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      } else if (defaultSignatureUrl) {
        signatureDataURL = defaultSignatureUrl;
      }

      await addDoc(collection(db, 'invoices'), {
        customerName: customer.name,
        customerEmail: customer.email,
        ...invoiceDetails,
        items,
        subtotal,
        total,
        ...salesInfo,
        signatureDataURL,
        userId: currentUser.uid,
      });

      // Handle successful save (e.g., redirect or show a success message)
      console.log('Invoice saved successfully');
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  return (
    <div className="create-invoice-page">
      <h1>Create Invoice</h1>
      <div className="customer-selection">
        <label htmlFor="customer">Customer:</label>
        <select
          id="customer"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>
      <div className="invoice-details">
        <label htmlFor="issueDate">Issue Date:</label>
        <input
          type="date"
          id="issueDate"
          value={invoiceDetails.issueDate}
          onChange={(e) =>
            setInvoiceDetails({ ...invoiceDetails, issueDate: e.target.value })
          }
        />
        <label htmlFor="dueDate">Due Date:</label>
        <input
          type="date"
          id="dueDate"
          value={invoiceDetails.dueDate}
          onChange={(e) =>
            setInvoiceDetails({ ...invoiceDetails, dueDate: e.target.value })
          }
        />
      </div>
      <div className="items-list">
        <h2>Items</h2>
        <div className="item-type-selection">
          <label htmlFor="itemType">Select Item Type:</label>
          <select id="itemType" value={itemType} onChange={(e) => setItemType(e.target.value)}>
            <option value="Generic Item">Generic Item</option>
            <option value="Mobile Phone">Mobile Phone</option>
            <option value="Laptop / Chromebook">Laptop / Chromebook</option>
            <option value="Apparel / Clothing">Apparel / Clothing</option>
          </select>
          <button onClick={addItem}>Add Item</button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="item-row">
            {Object.keys(item).map((key) => {
              if (key === 'type') return null;
              return (
                <input
                  key={key}
                  type={key === 'quantity' || key === 'price' ? 'number' : 'text'}
                  name={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                  value={item[key]}
                  onChange={(e) => handleItemChange(index, e)}
                />
              );
            })}
            <button onClick={() => removeItem(index)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="totals">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>
      <div className="sales-info">
        <label htmlFor="soldBy">Sold by:</label>
        <input
          type="text"
          id="soldBy"
          value={salesInfo.soldBy}
          onChange={(e) =>
            setSalesInfo({ ...salesInfo, soldBy: e.target.value })
          }
        />
        <label htmlFor="salesChannel">Sales Channel:</label>
        <input
          type="text"
          id="salesChannel"
          value={salesInfo.salesChannel}
          onChange={(e) =>
            setSalesInfo({ ...salesInfo, salesChannel: e.target.value })
          }
        />
      </div>
      <div className="signature-section">
        <h2>Signature</h2>
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ className: 'sigCanvas' }}
        />
        <button onClick={() => sigCanvas.current.clear()}>
          Clear Signature
        </button>
        <button onClick={async () => {
          try {
            const docRef = doc(db, 'settings', 'companyProfile');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.defaultSignatureUrl) {
                // We can't directly load an image URL onto the canvas.
                // Instead, we'll store it and use it if the canvas is empty on save.
                setDefaultSignatureUrl(data.defaultSignatureUrl);
                alert('Default signature URL loaded. It will be used if you leave the canvas blank.');
              } else {
                alert('No default signature URL found in settings.');
              }
            }
          } catch (error) {
            console.error('Error fetching default signature:', error);
          }
        }}>
          Use Default Signature
        </button>
      </div>
      <button onClick={handleSaveInvoice}>Save Invoice</button>
    </div>
  );
};

export default CreateInvoicePage;
