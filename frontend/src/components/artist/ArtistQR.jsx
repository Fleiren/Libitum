import { useRef } from 'react';
// ¡OJO AQUÍ! Cambiamos QRCodeSVG por QRCodeCanvas
import { QRCodeCanvas } from 'qrcode.react'; 
import useAuthContext from '../../hooks/useAuthContext.js';

const ArtistQR = () => {
    const { user } = useAuthContext();
    // Creamos una referencia para "apuntar" al cuadradito del QR y poder descargarlo
    const qrRef = useRef(null); 

    // Función mágica para descargar el QR como PNG
    const downloadQR = () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            //Definimos que el enlace será para descargar y le damos nombre.
            downloadLink.download = `QR_Libitum_${user.name}.png`; 

            //Como el botón no sabe descargar cosas creamos un enlace que se clica de forma automática cuando se pulsa el botón para que parezca que lo ha realizado el botón.
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    // Preparamos la URL (si aún no hay user, se queda vacía)
    const profileUrl = user?.id ? `${window.location.origin}/artist/${user.id}` : "";

    return (
        <div className="qr-wrapper">
            
            
            {!user && (
                <div className="qr-loading">
                    <p>Cargando información...</p>
                </div>
            )}

           
            {user && user.role !== 'artist' && (
                <div className="qr-error-state">
                    <h3>Acceso denegado</h3>
                    <p>Esta herramienta es exclusiva para los artistas registrados en Libitum.</p>
                </div>
            )}

            
            {user && user.role === 'artist' && (
                <div className="qr-content">
                    <h3 className="qr-title">Tu Código QR</h3>
                    <p className="qr-description">
                        Descarga este código e imprímelo para que tu público pueda hacerte donaciones fácilmente.
                    </p>
                    
                    {/* Metemos el ref aquí para que el botón sepa a qué sacarle la foto */}
                    <div className="qr-canvas-container" ref={qrRef}>
                        <QRCodeCanvas 
                            value={profileUrl} 
                            size={256} 
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"H"} 
                            includeMargin={true} // Mano de santo: le deja un margen blanco para que las impresoras no lo corten
                        />
                    </div>

                    {/* ¡EL BOTÓN DE DESCARGA! */}
                    <button 
                        type="button" 
                        onClick={downloadQR} 
                        className="btn-download"
                    >
                        Descargar como PNG
                    </button>

                    <p className="qr-link">
                        {/**Lo que hay en rel sirve para evitar que alguien pueda construir el camino de vuelta al origen de esta página y así no poder entrar en la cuenta del artista, se abrirá en una página nueva sin referencia a la de origen. */}
                        <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                            Ver cómo queda mi perfil público
                        </a>
                    </p>
                </div>
            )}

        </div>
    );
};

export default ArtistQR;