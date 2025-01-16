import React from "react";
import { ThemedLayoutContextProvider } from "@refinedev/mui";
import { ThemedHeaderV2 as DefaultHeader } from "./header";
import { ThemedSiderV2 as DefaultSider } from "./sider";
import { ThemedSiderV2 } from "../layout/sider";
import { ThemedHeaderV2 } from "../layout/header";
import { ThemedTitleV2 } from "../layout/title";
import Box from "@mui/material/Box";
import type { RefineThemedLayoutV2Props } from "@refinedev/mui";
import { LayoutProps } from "@refinedev/core";

  export const CustomLayoutV2: React.FC<RefineThemedLayoutV2Props> = ({
  Sider = ThemedSiderV2,
  Header = ThemedHeaderV2,
  Title = ThemedTitleV2,
  Footer,
  OffLayoutArea,
  children,
  initialSiderCollapsed = false,
}) => {
  console.log("Children:", children);
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;

   return (
    <ThemedLayoutContextProvider initialSiderCollapsed={initialSiderCollapsed}>

      <Box display="flex" flexDirection="row">
      
        <SiderToRender Title={Title} />
        <Box
          sx={[
            {
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: "1px",
              minHeight: "1px",
            },
          ]}
        >
  
          <HeaderToRender />

          <Box
            component="main"
            sx={{
              p: { xs: 1, md: 2, lg: 3 },
              flexGrow: 1,
              bgcolor: (theme) => theme.palette.background.default,
            }}
          >
            {children}
          </Box>
          {Footer && <Footer />}
        </Box>
        {OffLayoutArea && <OffLayoutArea />}
      </Box>
    </ThemedLayoutContextProvider>
  ); 


}; 

/*  export const CustomLayoutV2: React.FC<LayoutProps> = ({ children, Header }) => {

  console.log("CustomLayoutV2 Rendered");
  return (
      <div>
          {Header && <Header />}
          <div>{children}</div>
      </div>
  );
};  */