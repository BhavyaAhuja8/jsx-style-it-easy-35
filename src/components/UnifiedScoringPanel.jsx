import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ScoreRuleModal from './ScoreRuleModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useToast } from '@/hooks/useToast';

const UnifiedScoringPanel = () => {
  const [scoreRules, setScoreRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const { toast } = useToast();

  // Filter score rules based on search term
  const filteredRules = scoreRules.filter(rule =>
    rule.parameterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.productId?.toString().includes(searchTerm) ||
    rule.processName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Failed to load score rules",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
          title: "Score rule updated successfully",
          variant: "default"
        });
      } else {
        // TODO: Replace with actual API call
        // await apiService.createUnifiedScore(ruleData);
        toast({
          title: "Score rule created successfully",
          variant: "default"
        });
      }
      
      setIsModalOpen(false);
      loadScoreRules();
    } catch (error) {
      toast({
        title: editingRule ? "Failed to update score rule" : "Failed to create score rule",
        description: "Please try again",
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
        variant: "default"
      });
      
      setIsDeleteDialogOpen(false);
      setDeletingRule(null);
      loadScoreRules();
    } catch (error) {
      toast({
        title: "Failed to delete score rule",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Unified Scoring Panel</h1>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search parameters, process, product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            
            <Button
              onClick={loadScoreRules}
              variant="outline"
              size="icon"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button onClick={handleAddRule} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Score Rule
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Score Rules Found</h3>
            <p className="text-muted-foreground mb-6">
              {scoreRules.length === 0 
                ? "Get started by creating your first score rule."
                : "No rules match your search criteria."}
            </p>
            {scoreRules.length === 0 && (
              <Button onClick={handleAddRule} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Score Rule
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Parameter Name</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Process Name</TableHead>
                  <TableHead>Min Value</TableHead>
                  <TableHead>Max Value</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead>Updated On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>{rule.id}</TableCell>
                    <TableCell className="font-medium">{rule.parameterName}</TableCell>
                    <TableCell>{rule.productId}</TableCell>
                    <TableCell>{rule.processName}</TableCell>
                    <TableCell>{rule.minValue}</TableCell>
                    <TableCell>{rule.maxValue}</TableCell>
                    <TableCell>{rule.score}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{rule.updatedBy}</TableCell>
                    <TableCell>{new Date(rule.updatedOn).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleEditRule(rule)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteRule(rule)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Modals */}
        <ScoreRuleModal
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
    </div>
  );
};

export default UnifiedScoringPanel;