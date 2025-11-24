import styled from 'styled-components';

// --- CONTENEDORES ---

export const PageContainer = styled.div`
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const Card = styled.div`
  background: #FFFFFF;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.02), 0px 5px 10px rgba(0, 0, 0, 0.03);
  border-radius: 19px;
  padding: 25px;
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const CardTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 700;
  color: #63656b;
  border-bottom: 1px solid #efeff3;
  padding-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// --- FORMULARIOS E INPUTS ---

export const FormGroup = styled.div`
  margin-bottom: 15px;
  
  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #47484b;
    margin-bottom: 6px;
    margin-left: 4px;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 15px;
  border-radius: 9px;
  outline: none;
  border: 1px solid #e5e5e5;
  background: #fff;
  font-size: 14px;
  color: #2B2B2F;
  filter: drop-shadow(0px 1px 0px #efefef) drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
  transition: all 0.2s cubic-bezier(0.15, 0.83, 0.66, 1);

  &:focus {
    border-color: #4480FF;
    box-shadow: 0 0 0 3px rgba(68, 128, 255, 0.15);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #b0b0b5;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 42px;
  padding: 0 15px;
  border-radius: 9px;
  outline: none;
  border: 1px solid #e5e5e5;
  background: #fff;
  font-size: 14px;
  color: #2B2B2F;
  cursor: pointer;
  filter: drop-shadow(0px 1px 0px #efefef) drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));

  &:focus {
    border-color: #4480FF;
  }
`;

// --- BOTONES ---

export const Button = styled.button<{ variant?: 'primary' | 'danger' | 'outline' | 'success' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  height: 42px;
  border-radius: 9px;
  border: 0;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  
  /* Variantes */
  ${props => props.variant === 'primary' && `
    background: linear-gradient(180deg, #4480FF 0%, #115DFC 50%, #0550ED 100%);
    color: white;
    box-shadow: 0px 2px 4px rgba(68, 128, 255, 0.3);
    &:hover { box-shadow: 0px 4px 12px rgba(68, 128, 255, 0.5); transform: translateY(-1px); }
  `}

  ${props => props.variant === 'success' && `
    background: linear-gradient(180deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0px 2px 4px rgba(16, 185, 129, 0.3);
    &:hover { box-shadow: 0px 4px 12px rgba(16, 185, 129, 0.5); transform: translateY(-1px); }
  `}

  ${props => props.variant === 'danger' && `
    background: #fee2e2;
    color: #ef4444;
    &:hover { background: #fecaca; }
  `}

  ${props => props.variant === 'outline' && `
    background: transparent;
    border: 1px solid #e5e5e5;
    color: #63656b;
    &:hover { border-color: #4480FF; color: #4480FF; background: #f8faff; }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

// --- GRIDS Y TABLAS ---

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const GridAuto = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 16px;
    color: #94a3b8;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 1px solid #f1f5f9;
  }
  
  td {
    padding: 16px;
    border-bottom: 1px solid #f8fafc;
    color: #334155;
    font-size: 14px;
    font-weight: 500;
  }

  tr:hover td {
    background-color: #f8fafc;
  }
`;

export const Badge = styled.span<{ color?: string }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  background-color: ${props => props.color ? `${props.color}15` : '#e2e8f0'};
  color: ${props => props.color || '#64748b'};
  border: 1px solid ${props => props.color ? `${props.color}30` : 'transparent'};
`;