import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import React, {useEffect, useState, useMemo, useRef} from 'react'

export function sortNullable<T>(a: T | undefined | null, b: T | undefined | null, sortFunction: (a: T, b: T) => number, prioritize = false) {
    if(a == null && b == null) {
        return 0;
    }

    if(a == null) {
        return prioritize ? 1: -1;
    }

    if(b == null) {
        return prioritize ? -1: 1;
    }

    return sortFunction(a, b);
}

export function stringSort(a: string | number, b: string | number) {
    if(a > b) {
        return 1
    }
    if(b > a) {
        return -1;
    }
    return 0;
}


export function useSearch<T>(label: string, dataSelector: (v:T) => string) {

    const searchInput = useRef<any>(null);

    const handleSearch = (selectedKeys: string[], confirm: () => void) => {
        confirm();
    };

    const  handleReset = (clearFilters: () => void) => {
        clearFilters();
    };

return { 
    filterDropdown: ({ 
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
    }: {setSelectedKeys: (s: string[]) => void,
        selectedKeys: string[],
        confirm: () => void, 
        clearFilters: () => void }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${label}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: string, record: T) => {
        const v = dataSelector(record);
        return v ? v.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    },
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
 }
}