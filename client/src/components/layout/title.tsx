import React from "react";
import {
  useRouterContext,
  useLink,
  useRouterType,
  useRefineOptions,
} from "@refinedev/core";
import MuiLink from "@mui/material/Link";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import type { RefineLayoutThemedTitleProps } from "@refinedev/mui";
import { logo, yariga } from "../../assets";
import { LayoutProps } from "@refinedev/core";


export const ThemedTitleV2: React.FC<RefineLayoutThemedTitleProps> = ({
  collapsed,
  wrapperStyles,
  icon: iconFromProps,
  text: textFromProps,
  }) => {
  const { title: { icon: defaultIcon, text: defaultText } = {} } =
    useRefineOptions();
    typeof textFromProps === "undefined" ? defaultText : textFromProps;
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();
  
  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;  
  
  return (
    <MuiLink
      to="/"
      component={ActiveLink}
      underline="none"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        ...wrapperStyles,
      }}
    >

      {collapsed ? (
        <img src={logo} alt="Yariga" width="28px" />
         ) : (
        <img src={yariga} alt="Refine" width="140px" />
      )}
{/*       <SvgIcon height="24px" width="24px" color="primary">
        {logo}
      </SvgIcon>
      {!collapsed && (
        <Typography
          variant="h6"
          fontWeight={700}
          color="text.primary"
          fontSize="inherit"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {yariga}
        </Typography>
      )} */}
    </MuiLink>
  );
};   


 /* export const ThemedTitleV2: React.FC<LayoutProps> = ({ children, Header }) => {
  console.log("ThemedTitleV2 Rendered");

  return (
      <div>
          <h1>Custom Title Layout</h1>
          {Header && <Header />}
          <div>{children || "No children passed"}</div>
      </div>
  );
};  */