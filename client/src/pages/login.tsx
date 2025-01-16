import { useLogin } from "@refinedev/core";
import { useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ThemedTitleV2 } from "@refinedev/mui";

import {yariga} from "../assets/";

import { CredentialResponse } from "../interfaces/google";

// Todo: Update your Google Client ID here
const GOOGLE_CLIENT_ID =
  "863778557166-hl5avgjcqe327v3lijda7p0ql35b06tl.apps.googleusercontent.com";

export const Login: React.FC = () => {
  console.log("Login component rendered");
  const { mutate: login } = useLogin<CredentialResponse>();

  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      console.log("useEffect executed.");
      if (!window.google) {
        return;
      }
      console.log("Google API is loaded.");

      if (!divRef.current) {
        console.error("Google Button container not found.");
        return;
      }
    
      console.log("Google Button container found.");

      try {
        window.google.accounts.id.initialize({
          ux_mode: "popup",
          client_id: GOOGLE_CLIENT_ID,
          callback: async (res: CredentialResponse) => {
              console.log("Google callback response:",
              res);

              if (!res.credential) { console.error("Credential not found in response."); return;
              }
              if (res.credential) {
                console.log(Credential);
                login(res);
              }
          },
      });
      
      console.log("Google Button initialized successfully.");
      window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "medium",
          type: "standard",
        });
      } catch (error) {
        console.log(error);
      }
    }, []);

    return <div ref={divRef} />;
  };

  return (
     <Container
      sx = { {backgroundColor: "#FCFCFC"} }
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
   <div style={{ display: 'flex', gap: '36px', justifyContent: 'center', flexDirection: 'column' }}>
  <div>
    <img src={yariga} alt="Yariga Logo" />
  </div>
  <GoogleButton />
   </div>

    </Container>  
  );
};
