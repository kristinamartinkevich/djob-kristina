import { Placeholder } from 'react-bootstrap';

function Placeholders() {
    const length = 10;

    return (
        Array.from({ length: length }, (_, rowIndex) => (
            <tr key={rowIndex}>
                {Array.from({ length: 7 }, (_, colIndex) => (
                    <td key={colIndex}>
                        <Placeholder lg={12} />
                    </td>
                ))}
            </tr>
        ))
    );
};

export default Placeholders;