import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const ScoreRuleForm = ({ isOpen, onClose, onSave, editingRule }) => {
  const [formData, setFormData] = useState({
    parameterName: '',
    operator: '',
    productId: '',
    processName: '',
    minValue: '',
    score: '',
    isActive: true
  });

  useEffect(() => {
    if (editingRule) {
      setFormData({
        parameterName: editingRule.parameterName || '',
        operator: editingRule.operator || '',
        productId: editingRule.productId || '',
        processName: editingRule.processName || '',
        minValue: editingRule.minValue || '',
        score: editingRule.score || '',
        isActive: editingRule.isActive ?? true
      });
    } else {
      setFormData({
        parameterName: '',
        operator: '',
        productId: '',
        processName: '',
        minValue: '',
        score: '',
        isActive: true
      });
    }
  }, [editingRule, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            {editingRule ? 'Edit Score Rule' : 'Add New Score Rule'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Enter parameter name"
              value={formData.parameterName}
              onChange={(e) => handleChange('parameterName', e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div>
            <Select 
              value={formData.operator} 
              onValueChange={(value) => handleChange('operator', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="greater_than">Greater than (&gt;)</SelectItem>
                <SelectItem value="less_than">Less than (&lt;)</SelectItem>
                <SelectItem value="equal">Equal (=)</SelectItem>
                <SelectItem value="between">Between</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Enter product ID"
              value={formData.productId}
              onChange={(e) => handleChange('productId', e.target.value)}
              required
            />
            <Input
              placeholder="Enter process name"
              value={formData.processName}
              onChange={(e) => handleChange('processName', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Min"
              value={formData.minValue}
              onChange={(e) => handleChange('minValue', e.target.value)}
              type="number"
              required
            />
            <Input
              placeholder="Score"
              value={formData.score}
              onChange={(e) => handleChange('score', e.target.value)}
              type="number"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingRule ? 'Update Score Rule' : 'Create Score Rule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreRuleForm;