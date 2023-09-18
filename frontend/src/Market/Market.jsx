import * as marketStyles from './market.module.css'
import { useReducer, useState } from "react"
import { ORDER_STATUS, ORDER_TYPE } from "./constants"

const initialMarketState = [
    { id: 1, price: 25, quantity: 100, symbol: 'ETH', type: 'sell', status: 'open' },
    { id: 4, price: 26, quantity: 100, symbol: 'ETH', type: 'sell', status: 'open' },
    { id: 2, price: 20, quantity: 50, symbol: 'ETH', type: 'buy', status: 'open' },
    { id: 5, price: 19, quantity: 50, symbol: 'ETH', type: 'buy', status: 'open' },
    { id: 6, price: 19, quantity: 50, symbol: 'ETH', type: 'buy', status: 'open' },
]

function splitMarketOrdersByType(marketOrders) {
    const marketMap = {
        [ORDER_TYPE.BUY]: [],
        [ORDER_TYPE.SELL]: []
    }
    return marketOrders.reduce((market, order) => {
        market[order.type].push(order)

        return market
    }, marketMap)
}

function marketReducer(state, action) {
    console.log(JSON.stringify({ state, action }))
    switch (action.type) {
        case 'ADD_ORDER': {
            const { payload: newOrder } = action
            state = {
                ...state,
                [newOrder.type]: [...state[newOrder.type], newOrder]
            }
            // Check if can fulfill

            return newOrder.type === ORDER_TYPE.BUY ? fulfillBuyOrder(state, newOrder) : fulfillSellOrder(state, newOrder)

        }
    }

    return state
}

function totalOrderAmount({ quantity, price }) {
    return quantity
}

function updateOrderQuantity(order, amountBoughtOrSold) {
    return order.quantity - amountBoughtOrSold
}

function updateMatchingOrders(buyOrder, sellOrder) {
    const totalBuyAmount = totalOrderAmount(buyOrder)
    const totalSellAmount = totalOrderAmount(sellOrder)

    if (totalBuyAmount === totalSellAmount) {
        return {
            sellOrder: {
                ...sellOrder,
                quantity: 0,
                status: ORDER_STATUS.FULFILLED,
                priceFulfilled: sellOrder.price
            },
            buyOrder: {
                ...buyOrder,
                quantity: 0,
                status: ORDER_STATUS.FULFILLED,
                priceFulfilled: sellOrder.price
            }
        }
    }

    if (totalBuyAmount > totalSellAmount) {
        return {
            sellOrder: {
                ...sellOrder,
                quantity: 0,
                status: ORDER_STATUS.FULFILLED,
                priceFulfilled: sellOrder.price
            },
            buyOrder: {
                ...buyOrder,
                quantity: updateOrderQuantity(buyOrder, totalSellAmount),
                priceFulfilled: sellOrder.price
            }
        }
    }

    return {
        buyOrder: {
            ...buyOrder,
            quantity: 0,
            status: ORDER_STATUS.FULFILLED,
            priceFulfilled: sellOrder.price
        },
        sellOrder: {
            ...sellOrder,
            quantity: updateOrderQuantity(sellOrder, totalBuyAmount),
            priceFulfilled: sellOrder.price
        }
    }
}

function fulfillSellOrder(market, sellOrder) {
    if (sellOrder.status === ORDER_STATUS.FULFILLED) {
        return market
    }

    const buyOrder = market[ORDER_TYPE.BUY]
        .filter(order => order.status === ORDER_STATUS.OPEN)
        .sort((a, b) => a.price < b.price ? -1 : 1)
        .find(buyOrder => buyOrder.price >= sellOrder.price)

    if (!buyOrder) {
        return market
    }
    const newOrders = updateMatchingOrders(buyOrder, sellOrder)

    return fulfillSellOrder(updateMarketState(market, newOrders), newOrders.sellOrder)
}


function fulfillBuyOrder(market, buyOrder) {
    if (buyOrder.status === ORDER_STATUS.FULFILLED) {
        return market
    }

    const sellOrder = market[ORDER_TYPE.SELL]
        .filter(order => order.status === ORDER_STATUS.OPEN)
        .sort((a, b) => a.price > b.price ? 1 : -1)
        .find(sellOrder => sellOrder.price <= buyOrder.price)


    if (!sellOrder) {
        return market
    }

    const newOrders = updateMatchingOrders(buyOrder, sellOrder)

    return fulfillBuyOrder(updateMarketState(market, newOrders), newOrders.buyOrder)
}

function updateMarketState(market, { buyOrder, sellOrder }) {
    return {
        [ORDER_TYPE.BUY]: market[ORDER_TYPE.BUY].map(order => order.id === buyOrder.id ? buyOrder : order),
        [ORDER_TYPE.SELL]: market[ORDER_TYPE.SELL].map(order => order.id === sellOrder.id ? sellOrder : order),
    }
}

function getOrderStatusClassName(status) {
    if (status === ORDER_STATUS.FULFILLED) {
        return marketStyles.orderFulfilled
    }

    if (status === ORDER_STATUS.CANCELLED) {
        return marketStyles.orderCancelled
    }

    return marketStyles.orderOpen
}

const Order = ({ price, quantity, symbol, type, status, id, priceFulfilled }) => {
    return <div className={[marketStyles.order, getOrderStatusClassName(status)].join(' ')}>
        <p>ID: {id} - {symbol}</p>
        {status === ORDER_STATUS.FULFILLED ? <p>PRICE CLOSED: ${priceFulfilled}</p> : <p>{quantity} at ${price}</p>}
        <p>STATUS: {status}</p>
    </div>
}

const CreateOrder = ({ dispatch }) => {

    const [orderType, setOrderType] = useState(ORDER_TYPE.BUY)
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(1)
    // const [symbol, setSymbol] = useState('ETH')

    const handleCreateOrder = () => {
        if (price <= 0 || quantity <= 0) return

        dispatch({
            type: "ADD_ORDER", payload:
                { id: Math.trunc(Math.random() * 100000), price, quantity, symbol: 'ETH', type: orderType, status: ORDER_STATUS.OPEN }
        })

        setPrice(0)
        setQuantity(1)
    }

    return (
        <form className={marketStyles.createOrderForm}>
            <h3>Create new Order</h3>
            <div className={marketStyles.formInput}>
                <label htmlFor='price'>Price</label>
                <input id="price" type="number" min="0" placeholder='Price' name="price" value={price}
                    onChange={e => setPrice(e.target.valueAsNumber)} />
            </div>
            <div className={marketStyles.formInput}>
                <label htmlFor='quantity'>Quantity</label>
                <input id="quantity" type="number" min="1" placeholder='Quantity' name="quantity" value={quantity}
                    onChange={e => setQuantity(e.target.valueAsNumber)} />
            </div>

            <div className={marketStyles.formInput}>
                <label htmlFor='type'>Order type</label>
                <select value={orderType}
                    onChange={e => setOrderType(e.target.value)} >
                    {Object.values(ORDER_TYPE).map(value => <option value={value} key={value}>{value.toUpperCase()}</option>)}
                </select>
            </div>
            <button type="button" onClick={handleCreateOrder} >PLACE ORDER</button>
        </form>
    )
}

export const Market = () => {
    const [market, dispatch] = useReducer(marketReducer, splitMarketOrdersByType(initialMarketState))

    return <main>
        <h1>Market!</h1>
        <div className={marketStyles.market}>
            <div className={marketStyles.orders}>
                <h2>BUY ORDERS</h2>
                {market[ORDER_TYPE.BUY].map(order => <Order key={order.id} {...order} />)}
            </div>
            <div className={marketStyles.orders}>
                <h2>SELL ORDERS</h2>
                {market[ORDER_TYPE.SELL].map(order => <Order {...order} key={order.id} />)}
            </div>
        </div>


        <CreateOrder dispatch={dispatch} />


    </main>
}

