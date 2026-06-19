import { render, screen, fireEvent } from '@testing-library/react';
import { LocationModal } from './LocationModal';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

describe('LocationModal', () => {
  it('renders modal when isOpen is true', () => {
    render(<LocationModal isOpen={true} onClose={() => {}} onStoreSelected={() => {}} />);
    expect(screen.getByText('Find Your Local Store')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<LocationModal isOpen={false} onClose={() => {}} onStoreSelected={() => {}} />);
    expect(screen.queryByText('Find Your Local Store')).not.toBeInTheDocument();
  });
  
  it('calls onClose when close button clicked', () => {
    const handleClose = vi.fn();
    render(<LocationModal isOpen={true} onClose={handleClose} onStoreSelected={() => {}} />);
    
    // There is a close icon button with text 'close'
    const closeBtn = screen.getByText('close');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
