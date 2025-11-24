import styled, { css } from 'styled-components';

// --- LAYOUT BLOCKS ---

export const PageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px;
  width: 100%;
  animation: fadeIn 0.4s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const HeaderSection = styled.div`
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.01em;
`;

export const Subtitle = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  margin: 6px 0 0 0;
  font-weight: 400;
`;

// --- CARDS ---

export const Card = styled.div`
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 24px;
  border: var(--border-subtle);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: var(--shadow-md); 
    /* Efecto hover muy sutil, solo si es interactivo */
  }
`;

// --- INPUTS & FORMS ---

export const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: var(--radius-md);
  border: 1px solid #E5E5EA;
  background: #F2F2F7; /* Input style iOS */
  color: var(--text-primary);
  font-size: 15px;
  transition: all 0.2s;
  outline: none;

  &::placeholder { color: #AEAEB2; }

  &:focus {
    background: #FFFFFF;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }
`;

// --- BUTTONS ---

// ... imports anteriores

// Actualiza SOLO la definición de Button:
export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }>`
  height: 44px;
  padding: 0 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  letter-spacing: -0.01em;

  /* Variants usando $variant */
  ${props => {
    switch (props.$variant) {
      case 'secondary':
        return css`
          background: #E5E5EA;
          color: var(--text-primary);
          &:hover { background: #D1D1D6; }
        `;
      case 'danger':
        return css`
          background: #FFE5E5;
          color: var(--danger);
          &:hover { background: #FFD1D1; }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: var(--primary);
          &:hover { background: rgba(0, 113, 227, 0.08); }
        `;
      default: // Primary
        return css`
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
          &:hover { 
            transform: translateY(-1px);
            background: var(--primary-hover);
            box-shadow: 0 6px 16px rgba(0, 113, 227, 0.4);
          }
          &:active { transform: scale(0.98); }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;
// --- BADGES & STATUS ---

export const Badge = styled.span<{ type?: 'success' | 'warning' | 'danger' | 'neutral' }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  ${props => {
    switch (props.type) {
      case 'success': return css`background: #E4F9E8; color: var(--success);`;
      case 'warning': return css`background: #FFF4E5; color: var(--warning);`;
      case 'danger': return css`background: #FFE5E5; color: var(--danger);`;
      default: return css`background: #F2F2F7; color: var(--text-secondary);`;
    }
  }}
`;

// --- GRID SYSTEMS ---

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

export const Grid4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;