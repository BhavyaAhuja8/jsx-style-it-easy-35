import React, { useState, useEffect } from 'react';
import ScoringHeader from './ScoringHeader';
import ScoringTable from './ScoringTable';
import ScoreRuleForm from './ScoreRuleForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useToast } from '@/hooks/useToast';

const UnifiedScoringPanel = () => {
  const [scoreRules, setScoreRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const { toast } = useToast();

  // Filter score rules based on filter type
  const filteredRules = scoreRules.filter(rule => {
    if (filterType === 'all') return true;
    return rule.processName?.toLowerCase().includes(filterType.toLowerCase());
  });

  // Load score rules on component mount
  useEffect(() => {
    loadScoreRules();
  }, []);

  const loadScoreRules = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const data = await apiService.getScores();
      // setScoreRules(data);
      
      // Simulated empty state for now
      setScoreRules([]);
      
      toast({
        title: "Score rules loaded successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Failed to load score rules",
        description: "Please check your connection and try again",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Data refreshed successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Failed to refresh data",
        description: "Please try again",
        variant: "error"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddRule = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleDeleteRule = (rule) => {
    setDeletingRule(rule);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveRule = async (ruleData) => {
    try {
      if (editingRule) {
        // TODO: Replace with actual API call
        // await apiService.updateScore(editingRule.id, ruleData);
        toast({
          title: "Success!",
          description: `Score rule "${ruleData.parameterName}" has been updated successfully`,
          variant: "success"
        });
      } else {
        // TODO: Replace with actual API call
        // await apiService.createUnifiedScore(ruleData);
        toast({
          title: "Success!",
          description: `Score rule "${ruleData.parameterName}" has been created successfully`,
          variant: "success"
        });
      }
      
      setIsModalOpen(false);
      setEditingRule(null);
      loadScoreRules();
    } catch (error) {
      console.error('Error saving score rule:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save score rule. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // TODO: Replace with actual API call
      // await apiService.deleteScore(deletingRule.id);
      
      toast({
        title: "Score rule deleted successfully",
        description: `Rule "${deletingRule.parameterName}" has been removed`,
        variant: "success"
      });
      
      setIsDeleteDialogOpen(false);
      setDeletingRule(null);
      loadScoreRules();
    } catch (error) {
      toast({
        title: "Failed to delete score rule",
        description: error.message || "Please try again",
        variant: "error"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ScoringHeader
        filterType={filterType}
        setFilterType={setFilterType}
        onRefresh={handleRefresh}
        onAddRule={handleAddRule}
        loading={loading}
        refreshing={refreshing}
      />
      
      <div className="bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading score rules...</p>
            </div>
          </div>
        ) : (
          <ScoringTable
            rules={filteredRules}
            onEdit={handleEditRule}
            onDelete={handleDeleteRule}
          />
        )}
      </div>

      <ScoreRuleForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRule}
        editingRule={editingRule}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        ruleName={deletingRule?.parameterName}
      />
    </div>
  );
};

export default UnifiedScoringPanel;