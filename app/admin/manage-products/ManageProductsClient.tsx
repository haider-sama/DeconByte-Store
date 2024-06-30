'use client';

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formatPrice } from "@/app/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import { MdCached, MdClose, MdDelete, MdDone, MdRemoveRedEye } from "react-icons/md";
import ActionButton from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/libs/firebase";

interface ManageProductsClientProps {
    products: Product[];
}  

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({products}) => {
    const router = useRouter();
    const storage = getStorage(firebaseApp);
    let rows: any = [];

    if(products){
        rows = products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                price: formatPrice(product.price),
                category: product.category,
                brand: product.brand,
                inStock: product.inStock,
                images: product.images
            }
        })
    }

    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width: 220},
        {field: "name", headerName: "Name", width: 220},
        {field: "price", headerName: "Price(USD)", width: 220, renderCell: (params) => {
            return <div className="font-bold text-slate-800">{params.row.price}</div>
        }},
        {field: "category", headerName: "Category", width: 100},
        {field: "brand", headerName: "Brand", width: 100},
        {field: "inStock", headerName: "inStock", width: 120, renderCell: (params) => {
            return <div>{params.row.inStock === true ? 
            <Status text="inStock" icon={MdDone} bg="bg-green-400" color="text-green-400"/> 
            : <Status text="Out of Stock" 
            icon={MdClose} bg="bg-red-400" color="text-red-400"/>}</div>
        }},
        {field: "action", headerName: "Actions", width: 200, renderCell: (params) => {
            return <div className="flex justify-between gap-4 w-full">
                <ActionButton icon={MdCached} onClick={() => {
                    handleToggleStock(params.row.id, params.row.inStock)}} />
                <ActionButton icon={MdDelete} onClick={() => {
                    handleDelete(params.row.id, params.row.inStock)
                }} />
                <ActionButton icon={MdRemoveRedEye} onClick={() => {
                    router.push(`product/${params.row.id}`)
                }} />
            </div>
        }},
    ];

    const handleToggleStock = useCallback((id: string, inStock: boolean) => {
        axios.put("api/product", {
            id,
            inStock: !inStock
        }).then((response) => {
            toast.success("Product status changed!");
            router.refresh();
        }).catch((error) => {
            toast.error("Oops! Cannot change product status");
            console.log("error", error);
        })
    }, [])

    const handleDelete = useCallback(async(id: string, images: any[]) => {
        toast("Deleting product. Please wait...")

    const handleImageDelete = async() => {
        try{
            for(const item of images) {
                if(item.image) {
                    const imageRef = ref(storage, item.image);
                    await deleteObject(imageRef);
                    console.log("Image deleted", item.image);
                    toast.error("Image deleted");
                }
            }
        } catch(error) {
            console.log(error);
            return toast.error("Error deleting images");
        }
    }

    await handleImageDelete();

    axios.delete(`/api/product/${id}`).then((response) => {
        toast.success("Product deleted!");
        router.refresh();
    }).catch((error) => {
        toast.error("Oops! Cannot delete product");
        router.refresh();
    })
}, [])

    return(
        <div className="max-w-[1150px] m-auto text-xl">
            <div className="mb-4 mt-8">
                <Heading title="Manage Products" center/>
            </div>
            <div style={{height: 600, width: "100%"}}>
            <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
            pagination: {
                paginationModel: { page: 0, pageSize: 9 },
            },
        }}
            pageSizeOptions={[9, 20]}
            checkboxSelection
            disableRowSelectionOnClick/>
            </div>
        
        </div>
    )
}

export default ManageProductsClient;