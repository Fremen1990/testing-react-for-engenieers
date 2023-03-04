import React from 'react'
import {render, fireEvent} from '@testing-library/react'

import {useFilters} from '../../../hooks/useFilters'
import {FiltersContext} from '../../../context/filters'

describe('The useFilters hook', () => {

    const Panel = () => {
        const {toggleShowingFilters} = useFilters()
        return <button onClick={toggleShowingFilters}>Toggle</button>
    }

    it('❌ returns the current value of the filters context', () => {
        const toggleShowingFilters = jest.fn()
        const {getByText, debug} = render(<FiltersContext.Provider value={{toggleShowingFilters} as any}>
            <Panel/>
        </FiltersContext.Provider>)

        debug()

        fireEvent.click(getByText('Toggle'))
        expect(toggleShowingFilters).toHaveBeenCalled()
    })
})
