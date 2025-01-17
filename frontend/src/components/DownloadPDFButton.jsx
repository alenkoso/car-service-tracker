import React, { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import axios from 'axios';

export default function DownloadPDFButton({ vehicleId }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.get(
        `http://localhost:3000/api/exports/vehicle/${vehicleId}/pdf`,
        {
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition']?.split('filename=')[1] || 'service-records.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download service records');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-x-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
    >
      <ArrowDownTrayIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      {isLoading ? 'Generating...' : 'Download PDF'}
    </button>
  );
}