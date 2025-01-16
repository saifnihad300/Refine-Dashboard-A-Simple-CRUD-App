import React, { type CSSProperties, useState } from "react";
import {
  CanAccess,
  type ITreeMenu,
  useIsExistAuthentication,
  useLogout,
  useTitle,
  useTranslate,
  useRouterContext,
  useRouterType,
  useLink,
  useMenu,
  useRefineContext,
  useActiveAuthProvider,
  pickNotDeprecated,
  useWarnAboutChange,
} from "@refinedev/core";
import {
  ThemedTitleV2 as DefaultTitle,
} from "./title";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Dashboard from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListOutlined from "@mui/icons-material/ListOutlined";
import Logout from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { useThemedLayoutContext, type RefineThemedLayoutV2SiderProps } from "@refinedev/mui";
import { LayoutProps } from "@refinedev/core";
import { ChevronRight, MenuRounded } from "@mui/icons-material";
import { Button } from "@mui/material";


 export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({
  Title: TitleFromProps,
  render,
  meta,
  activeItemDisabled = false,
}) => {

/*   const {
    siderCollapsed,
    setSiderCollapsed,
    mobileSiderOpen,
    setMobileSiderOpen,
  } = useThemedLayoutContext();  */
  
  //console.log("Sider Collapsed:", siderCollapsed);
  //console.log("Mobile Sider Open:", mobileSiderOpen);


  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [mobileSiderOpen, setMobileSiderOpen] = useState<boolean>(false);
  

  const drawerWidth = () => {
    if (siderCollapsed) return 56;
    return 240;
  };

  const t = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;
  const { hasDashboard } = useRefineContext();
  const translate = useTranslate();

  const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
  
  const isExistAuthentication = useIsExistAuthentication();
  const TitleFromContext = useTitle();
  const authProvider = useActiveAuthProvider();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [open, setOpen] = useState<{ [k: string]: any }>({});

  React.useEffect(() => {
    setOpen((previous) => {
      const previousKeys: string[] = Object.keys(previous);
      const previousOpenKeys = previousKeys.filter((key) => previous[key]);

      const uniqueKeys = new Set([...previousOpenKeys, ...defaultOpenKeys]);
      const uniqueKeysRecord = Object.fromEntries(
        Array.from(uniqueKeys.values()).map((key) => [key, true])
      );
      return uniqueKeysRecord;
    });
  }, [defaultOpenKeys]); 

  const RenderToTitle = TitleFromProps ?? TitleFromContext ?? DefaultTitle;

  //console.log("Open State:", open);
/*   const handleClick = (key: string) => {
    console.log("Toggling key:", key, "Current state:", open[key]);
    setOpen({ ...open, [key]: !open[key] });
  }; */

  const handleClick = (key: string) => {
    console.log("handleClick called with key:", key);
    if (key) {
      console.log("Current state of open:", open);
      setOpen({ ...open, [key]: !open[key] });
    } else {
      console.error("Key is missing or undefined in handleClick");
    }
  };


  const renderTreeView = (tree: ITreeMenu[], selectedKey?: string) => {
    //console.log("Rendering tree view for:", tree);
    return tree.map((item: ITreeMenu) => {
      //console.log("Menu Item:", item);
      const { icon, label, route, name, children, parentName, meta, options } =
        item;
      const isOpen = open[item.key || ""] || false;
      const isSelected = item.key === selectedKey;

      const isNested = !(
        pickNotDeprecated(meta?.parent, options?.parent, parentName) ===
        undefined
      );

      console.log(children.length);
      if (children.length > 0) {
        
        return (
          <CanAccess
            key={item.key}
            resource={name}
            action="list"
            params={{
              resource: item,
            }}
          >
            <div key={item.key}>
              console.log(key)
              <Tooltip
                title={label ?? name}
                placement="right"
                disableHoverListener={!siderCollapsed}
                arrow
              >
                <ListItemButton
                  onClick={() => {
                    console.log("Item key:", item.key); // Debugging
                    if (siderCollapsed) {
                      setSiderCollapsed(false);
                      if (!isOpen) {
                        handleClick(item.key || "");
                      }
                    } else {
                      handleClick(item.key || "");
                    }
                  }}
                  sx={{
                    pl: isNested ? 4 : 2,
                    justifyContent: "center",
                    "&.Mui-selected": {
                        "&:hover": {
                            backgroundColor: "transparent",
                        },
                        backgroundColor: "transparent",
                    },
                }}
                >
                  <ListItemIcon
                    sx={{
                      justifyContent: "center",
                      minWidth: 36,
                      color: "primary.contrastText",
                    }}
                  >
                    {icon ?? <ListOutlined />}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                        noWrap: true,
                        fontSize: "16px",
                        fontWeight: isSelected
                            ? "bold"
                            : "normal",
                    }}
                  />
{/*                   {!isOpen ? (
                    <ExpandLess
                      sx={{
                        color: "text.icon",
                      }}
                    />
                  ) : (
                    <ExpandMore
                      sx={{
                        color: "text.icon",
                      }}
                    />
                  )} */}
                  {!siderCollapsed &&
                      (isOpen ? (
                        <ExpandLess 
                        sx={{
                          color: "text.icon",
                        }}
                        />
                          ) : (
                        <ExpandMore 
                        sx={{
                          color: "text.icon",
                        }}
                        />
                  ))}


                </ListItemButton> 
              </Tooltip>
              {!siderCollapsed && (
                <Collapse
                  in={open[item.key || ""]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {renderTreeView(children, selectedKey)}
                    console.log("Rendering tree view for menu items:", tree);

                  </List>
                </Collapse>
              )}
            </div>
          </CanAccess>
        );
      }

      const linkStyle: CSSProperties =
        activeItemDisabled && isSelected ? { pointerEvents: "none" } : {};

      return (

        <CanAccess
          key={item.key}
          resource={name}
          action="list"
          params={{ resource: item }}
        >
          <Tooltip
            title={label ?? name}
            placement="right"
            disableHoverListener={!siderCollapsed}
            arrow
          >
            <ListItemButton
              component={ActiveLink}
              to={route}
              selected={isSelected}
              style={linkStyle}
              onClick={() => {
                setMobileSiderOpen(false);
              }}
              sx={{
                pl: isNested ? 4 : 2,
                py: isNested ? 1.25 : 1,
                "&.Mui-selected": {
                    "&:hover": {
                        backgroundColor: isSelected
                            ? "#1e36e8"
                            : "transparent",
                    },
                    backgroundColor: isSelected
                        ? "#475be8"
                        : "transparent",
                },
                justifyContent: "center",
                margin: "10px auto",
                borderRadius: "12px",
                minHeight: "56px",
                width: "90%",
            }}
            >
              <ListItemIcon
                sx={{
                  justifyContent: "center",
                  minWidth: 36,
                  color: "#808191",
                  marginLeft: '6px',
                  marginRight: '14px'
                }}
              >
                {icon ?? <ListOutlined />}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                    noWrap: true,
                    fontSize: "16px",
                    fontWeight: isSelected ? "bold" : "normal",
                    color: isSelected ? "#fff" : "#808191",
                    marginLeft: "10px",
                }}
              />
            </ListItemButton>
          </Tooltip>
        </CanAccess>
      );
    });
  };

  console.log("Has Dashboard:", hasDashboard);
  const dashboard = hasDashboard ? (
    <CanAccess resource="dashboard" action="list">
      <Tooltip
        title={translate("dashboard.title", "Dashboard")}
        placement="right"
        disableHoverListener={!siderCollapsed}
        arrow
      >
        <ListItemButton
          component={ActiveLink}
          to="/"
          selected={selectedKey === "/"}
          onClick={() => {
            setMobileSiderOpen(false);
          }}
          sx={{
            pl: 2,
            py: 1,
            "&.Mui-selected": {
                "&:hover": {
                    backgroundColor: "transparent",
                },
                backgroundColor: "transparent",
            },
            justifyContent: "center",
        }}
        >
          <ListItemIcon
            sx={{
              justifyContent: "center",
              minWidth: "24px",
              transition: "margin-right 0.3s",
              marginRight: siderCollapsed ? "0px" : "12px",
              color: "#808191",
              fontSize: "14px",
            }}
          >
            <Dashboard />
            
          </ListItemIcon>
          <ListItemText
            primary={translate("dashboard.title", "Dashboard")}
            primaryTypographyProps={{
              noWrap: true,
              fontSize: "16px",
              fontWeight: "808191",
              marginLeft: "10px"
            }}
          />
        </ListItemButton>
      </Tooltip>
    </CanAccess>
  ) : null;

  const handleLogout = () => {
    if (warnWhen) {
      const confirm = window.confirm(
        t(
          "warnWhenUnsavedChanges",
          "Are you sure you want to leave? You have unsaved changes."
        )
      );

      if (confirm) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  };

  const logout = isExistAuthentication && (
    <Tooltip
      title={t("buttons.logout", "Logout")}
      placement="right"
      disableHoverListener={!siderCollapsed}
      arrow
    >
      <ListItemButton
        key="logout"
        onClick={() => handleLogout()}
        sx={{
          justifyContent: "center",
          margin: "10px auto", 
          borderRadius: "12px",
          minHeight: "56px",
          width: "90%"
        }}
      >
        <ListItemIcon
          sx={{
            justifyContent: "center",
            minWidth: "24px",
            transition: "margin-right 0.3s",
            marginRight: siderCollapsed ? "0px" : "12px",
            color: "#808191",
          }}
        >
          <Logout />
        </ListItemIcon>
        <ListItemText
          primary={t("buttons.logout", "Logout")}
          primaryTypographyProps={{
            noWrap: true,
            fontSize: "16px",
          }}
        />
      </ListItemButton>
    </Tooltip>
  );

  const items = renderTreeView(menuItems, selectedKey);

  const renderSider = () => {
    if (render) {
      return render({
        dashboard,
        logout,
        items,
        collapsed: siderCollapsed,
      });
    }
    return (
      <>
        {dashboard}
        {items}
        {logout}
      </>
    );
  };

  const drawer = (
    <List
      disablePadding
      sx={{
        color: "#808191",
        flexGrow: 1,
        paddingTop: "16px",
      }}
    >
      {renderSider()}
    </List>
  );

  return (
    <>
      <Box
        sx={{
          width: { xs: drawerWidth() },
          display: {
            xs: "none",
            md: "block",
          },
          transition: "width 0.3s ease",
        }}
      />
      <Box
        component="nav"
        sx={{
          position: "fixed",
          zIndex: 1101,
          width: { sm: drawerWidth() },
          display: "flex",
        }}
      >
        <Drawer
          variant="temporary"
          elevation={2}
          open={mobileSiderOpen}
          onClose={() => setMobileSiderOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: {
              sm: "block",
              md: "none",
            },
            "& .MuiDrawer-paper": {
              width: 256,
              bgcolor: "#FCFCFC",
          },
          }}
        >
            <Box
              sx={{
                height: 64,
                display: "flex",
                alignItems: "center",
                paddingLeft: "16px",
                fontSize: "14px",
              }}
            >
              <RenderToTitle collapsed={false} />
            </Box>
            {drawer}
        </Drawer>


        <Drawer
          variant="permanent"
          PaperProps={{ elevation: 0 }}
          sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  bgcolor: "#FCFCFC",
                  overflow: "hidden",
                  transition:
                      "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
              },
          }}
          open
        >
        {/*  {<Paper
            elevation={1}
            sx={{
              fontSize: "14px",
              width: "100%",
              height: 64,
              display: "flex",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: siderCollapsed ? "center" : "space-between",
              paddingLeft: siderCollapsed ? 0 : "16px",
              paddingRight: siderCollapsed ? 0 : "8px",
              variant: "outlined",
              borderRadius: 0,
              borderBottom: (theme) =>
                `1px solid ${theme.palette.action.focus}`,
            }}
          >
            <RenderToTitle collapsed={siderCollapsed} />
            {!siderCollapsed && (
              <IconButton size="small" onClick={() => setSiderCollapsed(true)}>
                {<ChevronLeft />}
              </IconButton>
            )}
          </Paper> }  */}
            <Box
              sx={{
                  height: 64,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
              }}
          >
              <RenderToTitle collapsed={siderCollapsed} />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            {drawer}
          </Box>

          <Button
              sx={{
                background: "#475BE8",
                color: "primary.contrastText",
                textAlign: "center",
                borderRadius: 0,
                borderTop: "1px solid #ffffff1a",
                "&:hover": {
                    background: "#1e36e8",
                },
                }}
                fullWidth
                size="large"
                onClick={() => {
                  console.log("Before update:", siderCollapsed);
                  setSiderCollapsed((prev) => !prev)}}
              >
              {siderCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </Drawer>

        <Box
            sx={{
                display: { xs: "block", md: "none" },
                position: "fixed",
                top: "64px",
                left: "0px",
                borderRadius: "0 6px 6px 0",
                bgcolor: "#475be8",
                zIndex: 1199,
                width: "36px",
            }}
              >
              <IconButton
                  sx={{ color: "#fff", width: "36px" }}
                  onClick={() => setOpen((prev) => !prev)}
              >
                 <MenuRounded />
              </IconButton>
        </Box>
      </Box>
    </>
  );
}; 
