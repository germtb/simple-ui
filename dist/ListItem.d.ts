import React from "react";
import { BaseListItemProps } from "./BaseListItem";
interface ListItemProps extends BaseListItemProps {
    headline: string;
    body?: string;
    bare?: boolean;
    children?: void;
}
export declare const ListItem: React.ForwardRefExoticComponent<Omit<ListItemProps, "ref"> & React.RefAttributes<HTMLLIElement>>;
export {};
