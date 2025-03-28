import {
  AuthBindings,
  Authenticated,
  GitHubBanner,
  Refine,
} from "@refinedev/core";
import type { AuthActionResponse, AuthProvider, CheckResponse } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  notificationProvider,
  ReadyPage,
  RefineSnackbarProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import axios, { AxiosHeaders, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { ColorModeContextProvider } from "./contexts/color-mode";
import { CredentialResponse } from "./interfaces/google";
import {
  AllProperties,
  CreateProperty
} from "./pages/";
/* import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories"; */
import { Login } from "./pages/login";
import { Home } from "./pages/";
import { parseJwt } from "./utils/parse-jwt";

import { ThemedSiderV2 } from "./components/layout/sider";
import { ThemedTitleV2 } from "./components/layout/title";
import { ThemedHeaderV2} from "./components/layout/header";
import { CustomLayoutV2 } from "./components/layout/index";
import { AccountCircleOutlined, ChatBubbleOutline, PeopleAltOutlined, StarOutlineRounded, VillaOutlined } from "@mui/icons-material";
import { avatarClasses } from "@mui/material";
import { userInfo } from "os";
import { useEffect } from "react";
import PropertyDetails from "./pages/property-details";
import EditProperty from "./pages/edit-property";
import { Agent } from "http";
import Agents from "./pages/agent";
import myProfile from "./pages/my-profile";
import MyProfile from "./pages/my-profile";
import AgentProfile from "./pages/agent-profile";


const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
    if (token) {

      if (!request.headers) {
        request.headers = new AxiosHeaders();
      }

      request.headers.set("Authorization", `Bearer ${token}`);
      console.log(token);
    }
    return request;
  },
  (error) => Promise.reject(error)
);

  function App() {
   const authProvider: AuthProvider = {

    login: async ({ credential }: CredentialResponse): Promise<AuthActionResponse> => {
      try {
        console.log("Credential received in login:", credential);
        if (!credential) {
          console.error("No credential provided.");
          return { success: false, error: new Error("No credential provided.") };
        }
        const profileObj = credential ? parseJwt(credential) : null;
        console.log("here is the profileobj: ", profileObj);
        
        if (profileObj) {
          const response = await fetch('https://refine-dashboard-a-simple-crud-app.onrender.com/api/v1/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: profileObj.name,
              email: profileObj.email,
              avatar: profileObj.picture,
            }),
          });
    
          const data = await response.json();
          console.log("data is: ", data);
    
          if (response.status === 200) {
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...profileObj,
                avatar: profileObj.picture,
                userid: data._id,
              }),
            );
            localStorage.setItem("token", `${credential}`);
            //console.log("User successfully saved to localStorage.");
            // Return success
             return{           
               success: true,
               redirectTo: "/", 
              }
          } else {
            console.error("Failed to save user to database.");
            return { success: false, error: new Error("Database error.") };
          } 
          
        }
/*         localStorage.setItem("token", `${credential}`);

        return Promise.resolve();   */
      } catch (error) {
        console.error("Login failed:", error);
        return {
          success: false,
          error: error instanceof Error ? error : new Error("Unknown error during login"),
        };
      }
      return { success: false, error: new Error("Unexpected error.") };
    },
    

    logout: async(): Promise<AuthActionResponse> => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};

        await new Promise((resolve) => {
            window.google?.accounts.id.revoke(token, () => {
                resolve(true); 
            });
        });

      }
       return {
        success: true,
        redirectTo: "/login",
      }; 
  },
  
 

  check: async (): Promise<CheckResponse> => {
    const token = localStorage.getItem("token");

    if (token) {
        return Promise.resolve({ success: true, authenticated: true  });
    }

    return Promise.reject({
        success: false,
        redirectTo: "/login",
        error: new Error("No token found"),
    });
},

 
  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return {};
  },
  
  getPermissions: async () => Promise.resolve(),

  getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        console.log("Fetched user from localStorage:", JSON.parse(user));
        return Promise.resolve(JSON.parse(user)); // Parse and return user data
      }
      console.warn("No user found in localStorage.");
      return null; 
    },
              
  }; 

   return (
     <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider("https://refine-dashboard-a-simple-crud-app.onrender.com/api/v1")}
                notificationProvider={notificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                ReadyPage={ReadyPage}
                DashboardPage={Home}
                resources={[
                  {
                    name: "Properties",
                    list: "/properties",
                    create: "/properties/create",
                    edit: "/properties/edit/:id",
                    show: "/properties/show/:id",
                    icon: <VillaOutlined />,
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "agents",
                    list: "/agents",
                    show: "/agents/show/:id",
                    icon: <PeopleAltOutlined />,
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "reviews",
                    list: Home,
                    icon: <StarOutlineRounded />,
                  },
                  {
                    name: "messages",
                    list: Home,
                    icon: <ChatBubbleOutline />,
                  },
                  {
                    name: "my-profile",
                    options: { label: "My Profile " },
                    list: "/my-profile",
                    icon: <AccountCircleOutlined />,
                  }, 
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "TKS8n5-2LFaXU-FmxqJA",
                }}
              >
                <ThemedSiderV2 />

                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                      
                      <CustomLayoutV2 Header={ThemedHeaderV2}>
                          <Outlet />
                        </CustomLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<Home />}
                    />
                    <Route path="/properties">
                      <Route index element={<AllProperties />} />
                      <Route path="create" element={<CreateProperty />} />
                      <Route path="edit/:id" element={<EditProperty/>} />
                      <Route path="show/:id" element={<PropertyDetails/>} />  
                    </Route>
                    <Route path="/agents">
                      <Route index element={<Agents />} />
                      <Route path="create" element={<CreateProperty />} />
                      {/* <Route path="edit/:id" element={<EditProperty/>} /> */}
                      <Route path="show/:id" element={<AgentProfile/>} />   
                    </Route>

                    <Route path="/my-profile" element={<MyProfile/>}/>


                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>   
)} 



export default App;

