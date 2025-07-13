import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ScoringTable = ({ rules, onEdit, onDelete }) => {
  if (rules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-400 mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Score Rules Found</h3>
        <p className="text-gray-600 mb-6">
          Get started by creating your first score rule to begin managing your scoring parameters.
        </p>
        <button className="text-blue-600 hover:text-blue-700">
          + Create First Score Rule
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="text-gray-700 font-medium">#</TableHead>
            <TableHead className="text-gray-700 font-medium">Parameter</TableHead>
            <TableHead className="text-gray-700 font-medium">Product ID</TableHead>
            <TableHead className="text-gray-700 font-medium">Process</TableHead>
            <TableHead className="text-gray-700 font-medium">Min</TableHead>
            <TableHead className="text-gray-700 font-medium">Max</TableHead>
            <TableHead className="text-gray-700 font-medium">Score</TableHead>
            <TableHead className="text-gray-700 font-medium">Status</TableHead>
            <TableHead className="text-gray-700 font-medium">Updated By</TableHead>
            <TableHead className="text-gray-700 font-medium">Updated On</TableHead>
            <TableHead className="text-gray-700 font-medium">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule, index) => (
            <TableRow key={rule.id || index} className="border-b hover:bg-gray-50">
              <TableCell className="text-gray-600">{index + 1}</TableCell>
              <TableCell className="font-medium">{rule.parameterName}</TableCell>
              <TableCell>{rule.productId}</TableCell>
              <TableCell>{rule.processName}</TableCell>
              <TableCell>{rule.minValue}</TableCell>
              <TableCell>{rule.maxValue || '—'}</TableCell>
              <TableCell className="font-medium">{rule.score}</TableCell>
              <TableCell>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  rule.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-gray-600">{rule.updatedBy}</TableCell>
              <TableCell className="text-gray-600">
                {rule.updatedOn ? new Date(rule.updatedOn).toLocaleDateString() : '—'}
              </TableCell>
              <TableCell>
                <button 
                  onClick={() => onEdit(rule)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Modify
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScoringTable;