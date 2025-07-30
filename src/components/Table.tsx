import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';
        
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
    const [page, setPage] = useState<number>(1);
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
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
    }, [page]);

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Artworks</h2>
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
                 <Paginator first={page} rows={10} totalRecords={120} rowsPerPageOptions={[10, 20, 30]} onPageChange={(current)=>{setPage(current.page)}} />
        </>
    );
}
        