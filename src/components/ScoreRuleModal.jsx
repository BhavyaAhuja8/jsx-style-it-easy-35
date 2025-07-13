import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ScoreRuleModal = ({ isOpen, onClose, onSave, editingRule }) => {
  const [formData, setFormData] = useState({
    parameterName: '',
    operator: '>',
    productId: '',
    processName: '',
    minValue: '',
    maxValue: '',
    score: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const operators = [
    { value: '>', label: 'Greater than (>)' },
    { value: '<', label: 'Less than (<)' },
    { value: '>=', label: 'Greater than or equal (>=)' },
    { value: '<=', label: 'Less than or equal (<=)' },
    { value: '==', label: 'Equal to (==)' },
    { value: '!=', label: 'Not equal (!=)' },
    { value: 'range', label: 'Range' }
  ];

  // Reset form when modal opens/closes or editingRule changes
  useEffect(() => {
    if (isOpen) {
      if (editingRule) {
        setFormData({
          parameterName: editingRule.parameterName || '',
          operator: editingRule.operator || '>',
          productId: editingRule.productId?.toString() || '',
          processName: editingRule.processName || '',
          minValue: editingRule.minValue?.toString() || '',
          maxValue: editingRule.maxValue?.toString() || '',
          score: editingRule.score?.toString() || '',
          isActive: editingRule.isActive !== false
        });
      } else {
        setFormData({
          parameterName: '',
          operator: '>',
          productId: '',
          processName: '',
          minValue: '',
          maxValue: '',
          score: '',
          isActive: true
        });
      }
      setErrors({});
    }
  }, [isOpen, editingRule]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.parameterName.trim()) {
      newErrors.parameterName = 'Parameter name is required';
    }

    if (!formData.productId.trim()) {
      newErrors.productId = 'Product ID is required';
    } else if (isNaN(formData.productId) || formData.productId <= 0) {
      newErrors.productId = 'Product ID must be a positive number';
    }

    if (!formData.processName.trim()) {
      newErrors.processName = 'Process name is required';
    }

    if (!formData.minValue.trim()) {
      newErrors.minValue = 'Min value is required';
    } else if (isNaN(formData.minValue)) {
      newErrors.minValue = 'Min value must be a number';
    }

    if (formData.operator === 'range') {
      if (!formData.maxValue.trim()) {
        newErrors.maxValue = 'Max value is required for range operator';
      } else if (isNaN(formData.maxValue)) {
        newErrors.maxValue = 'Max value must be a number';
      } else if (parseFloat(formData.maxValue) <= parseFloat(formData.minValue)) {
        newErrors.maxValue = 'Max value must be greater than min value';
      }
    }

    if (!formData.score.trim()) {
      newErrors.score = 'Score is required';
    } else if (isNaN(formData.score)) {
      newErrors.score = 'Score must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        productId: parseInt(formData.productId),
        minValue: parseFloat(formData.minValue),
        maxValue: formData.operator === 'range' ? parseFloat(formData.maxValue) : null,
        score: parseFloat(formData.score)
      };

      await onSave(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingRule ? 'Edit Score Rule' : 'Add New Score Rule'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Parameter Name */}
          <div className="space-y-1">
            <Label htmlFor="parameterName">Parameter Name *</Label>
            <Input
              id="parameterName"
              value={formData.parameterName}
              onChange={(e) => handleInputChange('parameterName', e.target.value)}
              placeholder="Enter parameter name"
              className={errors.parameterName ? 'border-red-500' : ''}
            />
            {errors.parameterName && (
              <p className="text-sm text-red-500">{errors.parameterName}</p>
            )}
          </div>

          {/* Operator */}
          <div className="space-y-1">
            <Label htmlFor="operator">Operator *</Label>
            <Select value={formData.operator} onValueChange={(value) => handleInputChange('operator', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product ID */}
          <div className="space-y-1">
            <Label htmlFor="productId">Product ID *</Label>
            <Input
              id="productId"
              type="text"
              value={formData.productId}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              placeholder="Enter product ID"
              className={errors.productId ? 'border-red-500' : ''}
            />
            {errors.productId && (
              <p className="text-sm text-red-500">{errors.productId}</p>
            )}
          </div>

          {/* Process Name */}
          <div className="space-y-1">
            <Label htmlFor="processName">Process Name *</Label>
            <Input
              id="processName"
              value={formData.processName}
              onChange={(e) => handleInputChange('processName', e.target.value)}
              placeholder="Enter process name"
              className={errors.processName ? 'border-red-500' : ''}
            />
            {errors.processName && (
              <p className="text-sm text-red-500">{errors.processName}</p>
            )}
          </div>

          {/* Min Value */}
          <div className="space-y-1">
            <Label htmlFor="minValue">Min Value *</Label>
            <Input
              id="minValue"
              type="text"
              value={formData.minValue}
              onChange={(e) => handleInputChange('minValue', e.target.value)}
              placeholder="Enter minimum value"
              className={errors.minValue ? 'border-red-500' : ''}
            />
            {errors.minValue && (
              <p className="text-sm text-red-500">{errors.minValue}</p>
            )}
          </div>

          {/* Max Value - Only show for range operator */}
          {formData.operator === 'range' && (
            <div className="space-y-1">
              <Label htmlFor="maxValue">Max Value *</Label>
              <Input
                id="maxValue"
                type="text"
                value={formData.maxValue}
                onChange={(e) => handleInputChange('maxValue', e.target.value)}
                placeholder="Enter maximum value"
                className={errors.maxValue ? 'border-red-500' : ''}
              />
              {errors.maxValue && (
                <p className="text-sm text-red-500">{errors.maxValue}</p>
              )}
            </div>
          )}

          {/* Score */}
          <div className="space-y-1">
            <Label htmlFor="score">Score *</Label>
            <Input
              id="score"
              type="text"
              value={formData.score}
              onChange={(e) => handleInputChange('score', e.target.value)}
              placeholder="Enter score"
              className={errors.score ? 'border-red-500' : ''}
            />
            {errors.score && (
              <p className="text-sm text-red-500">{errors.score}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.isActive ? 'active' : 'inactive'} 
              onValueChange={(value) => handleInputChange('isActive', value === 'active')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Saving...' : (editingRule ? 'Update Rule' : 'Create Rule')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreRuleModal;