import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// title, place_of_origin, artist_display, inscriptions, date_start, date_end

interface Product {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

export default function BasicDemo() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('https://api.artic.edu/api/v1/artworks?page=1');
            const data = await response.json();
            setProducts(data.data.map((item: Product) => ({
                id: item.id,
                title: item.title,
                place_of_origin: item.place_of_origin,
                artist_display: item.artist_display,
                inscriptions: item.inscriptions,
                date_start: item.date_start,
                date_end: item.date_end
            })));
        };

        fetchProducts();
    }, []);

    return (
        <div className="p-4">
            <DataTable value={products} tableStyle={{ minWidth: '50rem' }} className='border-2 border-blue-500 p-2 border-solid'>
                <Column field="id" header="ID" className='border-1 border-blue-500'></Column>
                <Column field="title" header="Title" className='border-1 border-blue-500'></Column>
                <Column field="place_of_origin" header="Place of Origin" className='border-1 border-blue-500'></Column>
                <Column field="artist_display" header="Artist Display" className='border-1 border-blue-500'></Column>
                <Column field="inscriptions" header="Inscriptions" className='border-1 border-blue-500'></Column>
                <Column field="date_start" header="Date Start" className='border-1 border-blue-500'></Column>
                <Column field="date_end" header="Date End" className='border-1 border-blue-500'></Column>
            </DataTable>
        </div>
    );
}
        