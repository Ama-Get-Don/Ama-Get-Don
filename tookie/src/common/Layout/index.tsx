import { PropsWithChildren, ReactElement } from "react";
import styled from "styled-components";
import { Layout as AntdLayout } from 'antd';
import AppHeader from "../../Header";

const { Content } = AntdLayout;

export function LayoutComponent({ children }: PropsWithChildren): ReactElement {
    return (
        <Layout>
            <AppHeader/>
            <AntdContent>{children}</AntdContent>
        </Layout>
    )
}


const Layout = styled(AntdLayout)`
    min-height: 100vh;
    background-color: white;
`;

const AntdContent = styled(Content)`
    background-color: white;
`;