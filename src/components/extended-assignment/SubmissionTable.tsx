import React, { useMemo } from 'react'
import { Table, Typography } from 'antd';
import { Solution } from 'interfaces/Solution';
import AttachmentLink from 'components/attachment-link/AttachmentLink';
import paths from 'paths';
import MarkInput from 'components/mark-input/MarkInput';
import { SortOrder } from 'antd/lib/table/interface';

const { Text, Link } = Typography;

const compareText = ((a: string, b: string) => {
    if (a > b) return 1;
    if (b > a) return -1;
    return 0;
})

const columns = (refreshData: () => void) => [
    {
        title: 'Student',
        dataIndex: 'student',
        key: 'student',
        sorter: (a: any,b: any) => compareText(a.student, b.student) as any,
    },
    {
        title: 'Group',
        dataIndex: 'group',
        key: 'group',
        sorter: (a: any,b: any) => compareText(a.group, b.group) as any,
        sortDirections: ['ascend', 'descend'] as SortOrder[],
    },
    {
        title: 'Solution',
        dataIndex: 'solution',
        key: 'solution',
        sorter: (a: any,b: any) => compareText(a.solution.title, b.solution.title) as any,
        render: (solution: any) => (
            <Link target="_blank" href={`${paths.EDIT_DIAGRAM}?solId=${solution.id}`} >
                <AttachmentLink>
                    {solution.title}
                </AttachmentLink>
            </Link>
        )
    },
    {
        title: 'Mark',
        dataIndex: 'mark',
        key: 'mark',
        render: (data: any) => (
            <MarkInput onChange={refreshData} className="pointer" {...data} />
        ),
        sorter: (a: any, b: any) => (a.mark.mark || 0) - (b.mark.mark || 0),
        onFilter: (value: any, { mark }: any) => (mark.mark || 0) === value,
        filters: [
            { text: 'N/A', value: 0 },
            ...new Array(10).fill(0).map((v, i) => ({ value: i + 1, text: i + 1 })),
        ] as any,
        defaultSortOrder: 'ascend' as SortOrder,
        sortDirections: ['ascend', 'descend'] as SortOrder[]
    },
]

type Props = {
    submissions: Partial<Solution>[],
    onRefreshData: () => void
}

function pickData(solution: Partial<Solution>) {
    return {
        student: "Ion Popa",
        group: 'A5',
        solution: { title: solution.title, id: solution.id },
        mark: { ...solution.mark, solutionId: solution.id },
        key: solution.id
    }
}

export default function SubmissionTable(props: Props) {
    const data = useMemo(() => props.submissions.map(pickData), [props.submissions])
    return (
        <Table columns={columns(props.onRefreshData)} dataSource={data} />
    )
}