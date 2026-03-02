import React, { useState } from 'react';
import { Button } from '../../../../shared/components/Button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

export const ExportReport = ({ onExport }) => {
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState('csv');

  const handleExport = async () => {
    try {
      setExporting(true);
      await onExport(format);
    } catch (error) {
      alert('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        disabled={exporting}
      >
        <option value="csv">CSV</option>
        <option value="xlsx">Excel</option>
        <option value="pdf">PDF</option>
      </select>

      <Button
        size="sm"
        onClick={handleExport}
        disabled={exporting}
      >
        <Download className="h-4 w-4 mr-2" />
        {exporting ? 'Exporting...' : 'Export Report'}
      </Button>
    </div>
  );
};