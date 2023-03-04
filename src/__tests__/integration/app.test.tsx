import React from 'react'
import {Axios} from '../../helpers/axios'
import {render, fireEvent, act, waitFor, getByText, getByTestId} from '@testing-library/react'
import {Provider as StoreProvider} from 'react-redux'
import {build, fake} from '@jackfranklin/test-data-bot'

import App from '../../components/App'
import {createStore} from '../../store'
import {FiltersWrapper} from '../../components/FiltersWrapper'


jest.mock('../../helpers/axios')

const mockAxios = Axios as jest.Mocked<typeof Axios>

const productBuilder = build('Product', {
    fields: {
        id: fake((f) => f.random.number()),
        name: fake((f) => f.commerce.productName()),
        image: fake((f) => f.image.imageUrl()),
        price: fake((f) => `from ${f.random.number(100)}`),
    }
})

describe('The app ', () => {
    const setupApp = () =>
        render(
            <StoreProvider store={createStore()}>
                <FiltersWrapper>
                    <App/>
                </FiltersWrapper>
            </StoreProvider>
        )

    afterEach(() => jest.clearAllMocks())

    test('❌ it fetches and renders all products on the page', async () => {
        mockAxios.get.mockResolvedValueOnce({
            data: [productBuilder(),
                productBuilder()]
        })

        const {findAllByTestId} = setupApp()
        expect(await findAllByTestId('ProductTile')).toHaveLength(2)
    })

    test('❌ it can open and close the filters panel', async () => {
        mockAxios.get.mockResolvedValueOnce({
            data: [productBuilder(),
                productBuilder()]
        })

        const {getByText, queryByText} = setupApp()

        const filterButton = getByText(/filter/i)

        expect(queryByText(/reset to defaults/i)).not.toBeInTheDocument()

        fireEvent.click(filterButton)

        expect(queryByText(/reset to defaults/i)).toBeInTheDocument()

        fireEvent.click(getByText(/view results/i))

        expect(queryByText(/reset to defaults/i)).not.toBeInTheDocument()
        expect(queryByText(/view results/i)).not.toBeInTheDocument()
    })

    test('❌ it can search products as user types in the search field', async () => {
        jest.useFakeTimers()

        mockAxios.get.mockResolvedValueOnce({
            data: [productBuilder(),
                productBuilder(), productBuilder(), productBuilder(), productBuilder()]
        }).mockResolvedValueOnce([productBuilder(), productBuilder()])

        const {getByText, getByTestId, findAllByTestId, getByPlaceholderText, debug} = setupApp()

        const filterButton = getByTestId("FilterButton")
        fireEvent.click(filterButton)
        const searchBox = getByPlaceholderText("largo")

        // debug()
        fireEvent.change(searchBox, {target: {value: 'searching'}})

        // act(() => {
        //     jest.runAllTimers()
        // })
        //
        // await waitFor(() => {
        //     expect(mockAxios.get).toHaveBeenCalledTimes(2)
        // })

        expect(await findAllByTestId('ProductTile')).toHaveLength(5)

    })
})
