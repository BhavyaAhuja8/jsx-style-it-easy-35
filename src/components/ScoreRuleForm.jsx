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
    maxValue: '',
    score: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingRule) {
      setFormData({
        parameterName: editingRule.parameterName || '',
        operator: editingRule.operator || '',
        productId: editingRule.productId || '',
        processName: editingRule.processName || '',
        minValue: editingRule.minValue || '',
        maxValue: editingRule.maxValue || '',
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
        maxValue: '',
        score: '',
        isActive: true
      });
    }
    setErrors({});
  }, [editingRule, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.parameterName.trim()) newErrors.parameterName = 'Parameter name is required';
    if (!formData.operator) newErrors.operator = 'Operator is required';
    if (!formData.productId.trim()) newErrors.productId = 'Product ID is required';
    if (!formData.processName.trim()) newErrors.processName = 'Process name is required';
    if (!formData.minValue) newErrors.minValue = 'Min value is required';
    if (!formData.score) newErrors.score = 'Score is required';
    if (formData.operator === 'range' && !formData.maxValue) {
      newErrors.maxValue = 'Max value is required for range operator';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-lg font-semibold text-center">
            {editingRule ? 'Edit Score Rule' : 'Add New Score Rule'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Parameter Name</label>
            <Input
              placeholder="Enter parameter name"
              value={formData.parameterName}
              onChange={(e) => handleChange('parameterName', e.target.value)}
              className={`w-48 hover:border-blue-400 focus:border-blue-500 transition-colors ${
                errors.parameterName ? 'border-red-500' : ''
              }`}
              onMouseEnter={(e) => e.target.classList.add('shadow-sm')}
              onMouseLeave={(e) => e.target.classList.remove('shadow-sm')}
            />
            {errors.parameterName && <p className="text-red-500 text-xs mt-1">{errors.parameterName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Operator</label>
            <Select 
              value={formData.operator} 
              onValueChange={(value) => handleChange('operator', value)}
            >
              <SelectTrigger className={`w-48 hover:border-blue-400 transition-colors ${
                errors.operator ? 'border-red-500' : ''
              }`}>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="greater_than">&gt; (Greater than)</SelectItem>
                <SelectItem value="less_than">&lt; (Less than)</SelectItem>
                <SelectItem value="greater_equal">&gt;= (Greater than or equal)</SelectItem>
                <SelectItem value="less_equal">&lt;= (Less than or equal)</SelectItem>
                <SelectItem value="equal">=== (Equal)</SelectItem>
                <SelectItem value="not_equal">≠ (Not equal)</SelectItem>
                <SelectItem value="range">Range</SelectItem>
              </SelectContent>
            </Select>
            {errors.operator && <p className="text-red-500 text-xs mt-1">{errors.operator}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Product ID</label>
              <Input
                placeholder="Enter product ID"
                value={formData.productId}
                onChange={(e) => handleChange('productId', e.target.value)}
                className={`w-32 hover:border-blue-400 focus:border-blue-500 transition-colors ${
                  errors.productId ? 'border-red-500' : ''
                }`}
                onMouseEnter={(e) => e.target.classList.add('shadow-sm')}
                onMouseLeave={(e) => e.target.classList.remove('shadow-sm')}
              />
              {errors.productId && <p className="text-red-500 text-xs mt-1">{errors.productId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Process Name</label>
              <Input
                placeholder="Enter process name"
                value={formData.processName}
                onChange={(e) => handleChange('processName', e.target.value)}
                className={`w-32 hover:border-blue-400 focus:border-blue-500 transition-colors ${
                  errors.processName ? 'border-red-500' : ''
                }`}
                onMouseEnter={(e) => e.target.classList.add('shadow-sm')}
                onMouseLeave={(e) => e.target.classList.remove('shadow-sm')}
              />
              {errors.processName && <p className="text-red-500 text-xs mt-1">{errors.processName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Min</label>
              <Input
                placeholder="Min"
                value={formData.minValue}
                onChange={(e) => handleChange('minValue', e.target.value)}
                type="number"
                className={`w-20 hover:border-blue-400 focus:border-blue-500 transition-colors ${
                  errors.minValue ? 'border-red-500' : ''
                }`}
                onMouseEnter={(e) => e.target.classList.add('shadow-sm')}
                onMouseLeave={(e) => e.target.classList.remove('shadow-sm')}
              />
              {errors.minValue && <p className="text-red-500 text-xs mt-1">{errors.minValue}</p>}
            </div>
            {formData.operator === 'range' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Max</label>
                <Input
                  placeholder="Max"
                  value={formData.maxValue}
                  onChange={(e) => handleChange('maxValue', e.target.value)}
                  type="number"
                  className={`w-20 hover:border-blue-400 focus:border-blue-500 transition-colors ${
                    errors.maxValue ? 'border-red-500' : ''
                  }`}
                  onMouseEnter={(e) => e.target.classList.add('shadow-sm')}
                  onMouseLeave={(e) => e.target.classList.remove('shadow-sm')}
                />
                {errors.maxValue && <p className="text-red-500 text-xs mt-1">{errors.maxValue}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Score</label>
              <Input
                placeholder="Score"
                value={formData.score}
                onChange={(e) => handleChange('score', e.target.value)}
                type="number"
                className={`w-20 hover:border-blue-400 focus:border-blue-500 transition-colors ${
                  errors.score ? 'border-red-500' : ''
                }`}
                onMouseEnter={(e) => e.target.classList.add('shadow-sm')}
                onMouseLeave={(e) => e.target.classList.remove('shadow-sm')}
              />
              {errors.score && <p className="text-red-500 text-xs mt-1">{errors.score}</p>}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 transition-all hover:shadow-lg"
              onMouseEnter={(e) => e.target.classList.add('scale-105')}
              onMouseLeave={(e) => e.target.classList.remove('scale-105')}
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