import Link from "next/link"

// 型宣言
interface PagiNationProps {
    allPageCnt: number;
}

// ページネーション処理
const PagiNation: React.FC<PagiNationProps> = ({ allPageCnt }) => {

    const PER_PAGE = 1;

    const range = (start:number, end:number) => [...Array(end - start + 1)].map((_, i) => start + i)

    return (
        <ul>
        {range(1, Math.ceil(allPageCnt / PER_PAGE)).map((number, index) => (
            <li key={index}>
                <Link href={`/${number}`}>{number}</Link>
            </li>
        ))}
        </ul>
    )
}

export default PagiNation
