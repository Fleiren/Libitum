import {useRef} from "react";
import {QRCodeCanvas} from "qrcode.react";
import useAuthContext from "../..hooks/useAuthContext.js";

const ArtistQR = () => {
    const {user} = useAuthContext();
    const qrRef = useRef(null);

    const profileURL = user?.id ? `${window.location.origin}/artist/${user.id}` : "";

    const downloadQR = () => {
        const canvas = qrRef.current.querySelector("canvas");
        if(canvas) {
            //Le cambiamos la etiqueta para decirle "esto no es una imagen para ver, es un archivo binario para descargar".
            const pngURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngURL;
            //Definimos el nombre que tendrá el archivo y que es un enlace de descarga.
            downloadLink.download = `QR_Libitum_${user.name}.png`;

            //Realizamos un clic falso, es decir, automático ya que el botón de por si no sabe descargar cosas por lo que al darle al botón de descargar,
            //ese botón parecerá que está descargando el archivo pero en realidad lo descarga este enlace que aparece y se clica de forma automática.
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
    return(
        <div className="qr-wrapper">
            
            {/* (cargando sesión) */}
            {!user && (
                <div className="qr-loading">
                    <p>Cargando información...</p>
                </div>
            )}

            {/* 2. pero NO es artista*/}
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
                    
                    
                    <div className="qr-canvas-container" ref={qrRef}>
                        <QRCodeCanvas 
                            value={profileUrl} 
                            size={256} 
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"H"} 
                            includeMargin={true} //Le deja un margen blanco para que las impresoras no lo corten.
                        />
                    </div>

                   
                    <button 
                        type="button" 
                        onClick={downloadQR} 
                        className="btn-download"
                    >
                        Descargar como PNG
                    </button>

                    {/**Se abre una ventana nueva segura sin referencia ni posiblidad de volver a la página de donde viene por seguridad para que nadie pueda rastrear nada. */}
                    <p className="qr-link">
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