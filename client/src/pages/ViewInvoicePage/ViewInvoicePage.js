import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import InvoiceTemplate from '../../components/InvoiceTemplate/InvoiceTemplate';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ViewInvoicePage = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const invoiceTemplateRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, 'invoices', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().userId === currentUser.uid) {
          setInvoice({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Invoice not found or you do not have permission to view it.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchInvoice();
    }
  }, [id, currentUser]);

  const handleDownloadPdf = () => {
    const input = invoiceTemplateRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${id}.pdf`);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="view-invoice-page">
      <button
        onClick={handleDownloadPdf}
        style={{ backgroundColor: '#0A74DA', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
      >
        Download PDF
      </button>
      <div ref={invoiceTemplateRef}>
        <InvoiceTemplate invoice={invoice} />
      </div>
    </div>
  );
};

export default ViewInvoicePage;
