import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, ruleName }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Delete confirmation error:', error);
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
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="bg-white border-0 shadow-xl animate-scale-in">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                Delete Score Rule
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-3 text-sm text-gray-600">
                Are you sure you want to delete the score rule <span className="font-medium text-gray-900">"{ruleName}"</span>? 
                This action cannot be undone and will permanently remove the rule from the system.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all duration-200 hover:shadow-md"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </div>
            ) : (
              'Delete Rule'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;