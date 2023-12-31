import "./App.css"
import {Layout, Menu, Breadcrumb, theme, MenuProps} from "antd";
import React, {SyntheticEvent, useEffect} from "react";
import {ItemType, MenuItemType} from "antd/es/menu/hooks/useItems";
import {Outlet, useLocation, useNavigate, useRoutes} from "react-router-dom";
import {UserOutlined} from '@ant-design/icons';
import {AuthUserMenu} from "../entities";
import {authApi, useLogOutMutation} from "../features";

const {Header, Content, Footer, Sider} = Layout;

function Main() {

    const location = useLocation()
    const navigate = useNavigate()
    const [logout, logoutRes] = useLogOutMutation()

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const onClickMenu = (data: any) => {
        navigate(data.key)
    }

    const items: ItemType<MenuItemType>[] = [
        {
            key: "/users",
            label: "Users",
            icon: React.createElement(UserOutlined),
            onClick: onClickMenu,
        }
    ]

    useEffect(() => {
        // if (items.length) {
        //     navigate(items[0]?.key)
        // }
    }, [])

    const onClickAuthUserMenu: MenuProps['onClick'] = (e) => {
        if (e.key === "logout") {
            logout(null)
                .unwrap()
                .then(() => {
                    authApi.util.resetApiState()
                    navigate("/login")
                })
        }
    }

    return (
        <Layout className="main-layout">
            <Header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: "space-between",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
                zIndex: 10
            }}
            >
                <div></div>
                <AuthUserMenu onClick={onClickAuthUserMenu}/>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                    <Layout style={{padding: '24px 0', background: colorBgContainer, flexGrow: 1}}>
                        <Sider style={{background: colorBgContainer}} width={200}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={[location.pathname]}
                                style={{height: '100%'}}
                                items={items}
                            />
                        </Sider>
                        <Content style={{padding: '0 24px', minHeight: 280}}>
                            <Outlet/>
                        </Content>
                    </Layout>
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
    )
}

export default Main
