import * as React from 'react';
import { useInterval } from './useInterval';
import { useDebounce } from './useDebounce';

export const Hooks = () => {
    return <>
        <Interval />
        <Debounce />
    </>
}

export const Interval = () => {
    const [count, setCount] = React.useState(0);
    const [delay, setDelay] = React.useState(1000);
    const [isRunning, toggleIsRunning] = React.useReducer(val => !val, true);

    useInterval(
        () => {
            setCount(c => c + 1);
        },
        isRunning ? delay : null
    );

    return (
        <div>
            <div>
                delay: <input value={delay} onChange={event => setDelay(Number(event.target.value))} />
            </div>
            <h1>count: {count}</h1>
            <div>
                <button onClick={toggleIsRunning}>{isRunning ? 'stop' : 'start'}</button>
            </div>
        </div>
    );
};

const Debounce = () => {
    const [state, setState] = React.useState('Typing stopped');
    const [val, setVal] = React.useState('');
    const [debouncedValue, setDebouncedValue] = React.useState('');

    const [isReady, cancel] = useDebounce(
        () => {
            setState('Typing stopped');
            setDebouncedValue(val);
        },
        2000,
        [val]
    );

    return (
        <div>
            <input
                type="text"
                value={val}
                placeholder="Debounced input"
                onChange={({ currentTarget }) => {
                    setState('Waiting for typing to stop...');
                    setVal(currentTarget.value);
                }}
            />
            <div>{state}</div>
            <div>
                Debounced value: {debouncedValue}
                <button onClick={cancel}>Cancel debounce</button>
            </div>
        </div>
    );
};