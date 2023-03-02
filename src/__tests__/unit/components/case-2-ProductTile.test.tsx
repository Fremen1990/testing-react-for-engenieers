import React from 'react'
import {axe} from 'jest-axe'
import {getByAltText, render} from '@testing-library/react'
import ProductTile from '../../../components/ProductTile'

describe('The <ProductTile /> component', () => {

    const defaultProduct = {
        id: 12,
        name: 'Example Product Name',
        image: '/image.png',
        price: 'from $12.99',
        brand: "Adidas",
        createdAt: "2021-03-01T00:00:00.000Z",
        isActive: true,
    }

    it('❌ renders a product tile with name, image and price', () => {
        const {getByText, getAllByAltText, container} = render(<ProductTile {...defaultProduct as any}/>)
        expect(getByText(defaultProduct.name)).toBeInTheDocument()
        expect(getByText(defaultProduct.price)).toBeInTheDocument()
        expect(getByAltText(container, defaultProduct.name)).toBeInTheDocument()
    })

    it('❌ renders a product tile with name and price only', () => {
        const {queryByAltText, queryByTestId} = render(<ProductTile {...{...defaultProduct, image: undefined} as any}/>)
        expect(queryByAltText(defaultProduct.name)).not.toBeInTheDocument()
        expect(queryByTestId('ProductTileImage')).not.toBeInTheDocument()
    })

    it('❌ has no accessibility violations', async () => {
        const {container} = render(<ProductTile {...defaultProduct as any}/>)
        expect(await axe(container)).toHaveNoViolations()

    })
})
