import React, { useMemo } from 'react'
import { Table, Typography } from 'antd';
import { EvaluatedSolution, Solution } from 'interfaces/Solution';
import AttachmentLink from 'components/attachment-link/AttachmentLink';
import paths from 'paths';
import MarkInput from 'components/mark-input/MarkInput';
import { SortOrder } from 'antd/lib/table/interface';
import { EvaluatedStudent, Teacher } from 'shared/interfaces/User';
import { SERVER_DATE_TIME } from 'shared/constants';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

const compareText = ((a: string, b: string) => {
    if (a > b) return 1;
    if (b > a) return -1;
    return 0;
})

const compareNullableText = (a?: string, b?: string) => {
    if(a == null && b == null) {
        return 0;
    }
    if(a == null) {
        return -1;
    }

    if(b == null) {
        return 1;
    }

    return compareText(a, b);
}

const sortBySolutionExistence = (a: EvaluatedStudent, b:EvaluatedStudent) => {
    if(!a.solution && !b.solution) {
        return 0;
    }
    if(!a.solution) {
        return -1;
    }
    if(!b.solution) {
        return 1;
    }
    return 0;
}

const extractMark = (s: EvaluatedStudent) => !s.solution ? -1 : s.solution.mark || 0;

const concatName = ({firstName, lastName}: EvaluatedStudent | Teacher) => `${firstName} ${lastName}`;

const columns = (refreshData: () => void) => [
    {
        title: 'Student',
        dataIndex: 'firstName',
        key: 'student',
        sorter: (a: any,b: any) => compareText(concatName(a) , concatName(b)) as any,
        render: (name: string, obj: EvaluatedStudent) => concatName(obj)
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        filtered: true,
        sorter: (a: any,b: any) => compareText(concatName(a) , concatName(b)) as any,
        render: (email: string) => email
    },
    {
        title: 'Solution',
        dataIndex: 'solution',
        key: 'solution',
        sorter: (a: any,b: any) => compareNullableText(a?.solution?.title, b?.solution?.title) as any,
        onFilter: (showOnlyExisting: any, s: EvaluatedStudent) => showOnlyExisting ? !!s.solution: !s.solution,
        defaultFilteredValue: [1],
        filters: [
            {
                text: 'With solution', value: 1
            },
            {
                text: 'Without solution', value: 0
            }
        ],
        render: (solution?: EvaluatedSolution) => solution ? (
            <Link target="_blank" href={`${paths.EDIT_DIAGRAM}?solId=${solution.id}`} >
                <AttachmentLink>
                    {solution.title}
                </AttachmentLink>
            </Link>
        ) : '-'
    },
    {
        title: 'Submitted at',
        dataIndex: ['solution', 'submittedAt'],
        key: 'group',
        render: (v?: string) => v ? moment(v, SERVER_DATE_TIME).format(SERVER_DATE_TIME): '-',
        sorter: (a: EvaluatedStudent,b: EvaluatedStudent) => compareNullableText(a?.solution?.submittedAt as any, b?.solution?.submittedAt as any),
        sortDirections: ['ascend', 'descend'] as SortOrder[],
    },
    {
        title: 'Reviewed at',
        dataIndex: ['solution', 'reviewedAt'],
        key: 'reviewed_at',
        render: (v?: string) => v ? v : '-',
        sortDirections: ['ascend', 'descend'] as SortOrder[],
        defaultSortOrder: 'descend' as SortOrder,
        sorter: (a: EvaluatedStudent, b: EvaluatedStudent) => {
            const solutionSort = sortBySolutionExistence(a, b);
            if(solutionSort != 0) {
                return solutionSort;
            }

            if(!a.solution?.reviewedAt && !b.solution?.reviewedAt) {
                return 0;
            }
            if(!a.solution?.reviewedAt) {
                return 1;
            }
            if(!b.solution?.reviewedAt) {
                return -1;
            }
            return compareText(a.solution.reviewedAt as string, b.solution.reviewedAt as string);
        }
    },
    {
        title: 'Mark',
        dataIndex: ['solution', 'mark'],
        key: 'mark',
        render: (data: any, obj: EvaluatedStudent) => obj.solution ? (
            <MarkInput 
                onChange={refreshData}
                mark={data} 
                solutionId={obj.solution.id} />
        ): '-',
        sorter: (a: EvaluatedStudent, b: EvaluatedStudent) => extractMark(a) - extractMark(b),
        onFilter: (value: any, s: EvaluatedStudent) => extractMark(s) === value,
        filters: [
            { text: 'N/A', value: 0 },
            ...new Array(10).fill(0).map((v, i) => ({ value: i + 1, text: i + 1 })),
        ] as any,
        width: 50,
        sortDirections: ['ascend', 'descend'] as SortOrder[]
    },
]

type Props = {
    students: EvaluatedStudent[],
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

export default function SubmissionTable({students, onRefreshData}: Props) {
    return (
        <Table rowKey="id"  columns={columns(onRefreshData)} pagination={{pageSize: 10}} dataSource={students} />
    )
}