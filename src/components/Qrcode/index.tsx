import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Qrcode.module.scss'

interface QRCodeComponentProps {
  file: string; 
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ file }) => {
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string>()
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState()

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

  return (
    <div className={styles.container}>
      <p className={styles.status_compra}>Status da compra : {status}</p>
      {status != 'approved' && (
        <div className={styles.container_qr_code}>
          {qrCodeBase64 && <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code" className={styles.imagem_qr_code} />}
          <div>
            <input
              type="text"
              id="copiar"
              value={qrCode}
              readOnly
            />
            <button onClick={handleCopyClick}>
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeComponent;