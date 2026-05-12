import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import useAPI from "../../hooks/useAPI.js";
import useMessageContext from "../../hooks/useMessageContext,js";

const ArtistProfile = () => {
    const {id} = useParams();
    const [artist, setArtist] = useState(null);
    const {error, loading, getData} = useAPI();
    const {showMessahe} = useMessageContext();
    useEffect(() => {
        const fetchArtistProfile = async() => {
            try {
                const data = await getData(`http://localhost:8000/api/artists/${id}`);
                setArtist(data);
            }catch(error){
                showMessage("No se ha podido cargar el perfil del artista.", "error");
            }
        };
        fetchArtistProfile();
    }, [id]);
}