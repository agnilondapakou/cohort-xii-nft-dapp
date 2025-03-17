import { Box, Flex, Text } from "@radix-ui/themes";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import WalletConnection from "./WalletConnection";
import './index.css'

const Header = () => {
    return (
        <Flex
            gap="3"
            as="header"
            width="100%"
            align="center"
            justify="between"
            className="p-4 items-center h-18"
            id="header"
        >
            <Box>
                <Text
                    className="text-secondary font-bold text-2xl"
                    as="span"
                    role="img"
                    aria-label="logo"
                >
                    <Icon></Icon>
                    NFT Minter
                </Text>
            </Box>
            <WalletConnection />
        </Flex>
    );
};

export default Header;
