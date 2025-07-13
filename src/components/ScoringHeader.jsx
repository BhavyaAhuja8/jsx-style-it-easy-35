import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ScoringHeader = ({ 
  filterType, 
  setFilterType, 
  onRefresh, 
  onAddRule, 
  loading, 
  refreshing 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Unified Scoring Panel</h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={onRefresh}
            variant="outline"
            disabled={loading || refreshing}
            className="border-gray-300"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            onClick={onAddRule}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Add
          </Button>
        </div>
      </div>
      
      <div className="w-48">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="bg-white border-gray-300 hover:border-gray-400 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-32">
            <SelectItem value="all">All Processes</SelectItem>
            <SelectItem value="term">Term</SelectItem>
            <SelectItem value="health insurance">Health Insurance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ScoringHeader;