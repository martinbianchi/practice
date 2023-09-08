import React, { useReducer } from "react"

import styles from "./styles.module.css"


let filesStructure = [
    {
        label: 'first',
        children: [
            { label: 'first-first', children: [{ label: 'first-first-first', children: [] }, { label: 'first-first-second' }] },
            { label: 'first-second', children: [{ label: 'first-second-first' }] }
        ],
    },
    {
        label: 'second',
        children: []
    }
]

function SidebarItemLabel({ label }) {
    console.log({ label })
    const [collapsed, toggleCollapsed] = useReducer(val => !val, false)
    return <div data-collapsed={collapsed} onClick={toggleCollapsed} className={styles.sidebarItem}>
        <span>{label}</span>
    </div>
}

function createTreeViewer(tree) {
    return tree.map(leaf => (
        <React.Fragment key={leaf.label}>
            <SidebarItemLabel label={leaf.label} />
            {leaf?.children?.length > 0
                ? <div className={styles.sidebarChildren}>
                    {createTreeViewer(leaf.children)}
                </div>
                : null}
        </React.Fragment >
    ))
}

export const FileTreeViewer = () => {
    return <main className={styles.main}>
        <h1 className={styles.pageTitle}>File tree viewer</h1>
        <div className={styles.sidebar}>
            {createTreeViewer(filesStructure)}
        </div>
    </main>
}