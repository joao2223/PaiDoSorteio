import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext';

interface StatusComponentProps {
  file: string;
  id: number;
  name: string;
  phone: string
}

const StatusComponent: React.FC<StatusComponentProps> = ({ file, id, name, phone }) => {
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string>()
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState()
  const { token } = useAuth();

  const acc = 'APP_USR-475581657188028-071815-8408e2a91f964626a4b56ed758a65abf-180659991';

  useEffect(() => {
    axios.get(`https://api.mercadopago.com/v1/payments/${file}`, {
      headers: {
        'Authorization': `Bearer ${acc}`
      }
    })
      .then(response => {
        if (response.data && response.data.point_of_interaction && response.data.point_of_interaction.transaction_data) {
          const qrCodeBase64 = response.data.point_of_interaction.transaction_data.qr_code_base64;
          const qrCode = response.data.point_of_interaction.transaction_data.qr_code;
          const status = response.data.status
          setQrCodeBase64(qrCodeBase64);
          setQrCode(qrCode)
          setStatus(status)
        }
      })
      .catch(error => {
        console.log('Erro ao buscar QR Code:', error);
      });
  }, [file]);

  const handleCopyClick = () => {
    const textToCopy = qrCode;

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch(err => {
          console.error('Erro ao copiar: ', err);
        });
    }
  };

  if (status === 'approved') {
    const formData = { 'name': name, 'phone': phone, 'userStatus': 'TRUE' }
    axios.put(`https://rifas-heroku-3f8d803a7c71.herokuapp.com/users/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then()
      .catch(error => console.log(error))
  }

  return (
    <td>{status}</td>
  );
};

export default StatusComponent;