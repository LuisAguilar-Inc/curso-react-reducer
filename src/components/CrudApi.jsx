import React, { useState, useEffect, useReducer } from 'react';
import { helpHttp } from '../helpers/helpHttp';
import { crudinitialState, crudReducer } from '../reducers/crudReducer';
import CrudForm from './CrudForm';
import CrudTable from './CrudTable';
import Loader from './Loader';
import Menssaje from './Message';
import { TYPES } from '../actions/crudActions';

const CrudApi = () => {
   //const [db, setDb] = useState(null);
   const [state, dispatch] = useReducer(crudReducer, crudinitialState);
   const { db } = state;
   const [dataToEdit, setDataToEdit] = useState(null);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);

   let api = helpHttp();
   let url = 'http://localhost:5000/santos';

   /* Ejecucion Principal de la peticion y estableciendo los valores por default */
   useEffect(() => {
      setLoading(true);
      helpHttp()
         .get(url)
         .then((res) => {
            //console.log(res);

            if (!res.err) {
               //setDb(res);
               dispatch({ type: TYPES.READ_ALL_DATA, payload: res });
               setError(null);
            } else {
               //setDb(null);
               dispatch({ type: TYPES.NO_DATA });
               setError(res);
            }

            setLoading(false);
         });
   }, [url]);

   const createData = (data) => {
      data.id = Date.now();

      let options = {
         body: data,
         headers: { 'content-type': 'application/json' },
      };

      api.post(url, options).then((res) => {
         console.log(res);

         if (!res.err) {
            //setDb([...db, res]);
            dispatch({ type: TYPES.CREATE_DATA, payload: res });
         } else {
            setError(res);
         }
      });
   };

   const updateData = (data) => {
      let endpoint = `${url}/${data.id}`;

      let options = {
         body: data,
         headers: { 'content-type': 'application/json' },
      };

      api.put(endpoint, options).then((res) => {
         if (!res.err) {
            //setDb(newData);
            dispatch({ type: TYPES.UPDATE_DATA, payload: data });
         } else {
            setError(res);
         }
      });
   };

   const deleteData = (id) => {
      let isDelete = window.confirm(
         `¿Estas seguro de eliminar el registro con el id ${id}?`
      );

      if (isDelete) {
         let endpoint = `${url}/${id}`;

         let options = {
            headers: { 'content-type': 'application/json' },
         };

         api.del(endpoint, options).then((res) => {
            if (!res.err) {
               //setDb(newData);
               dispatch({ type: TYPES.DELETE_DATA, payload: id });
            } else {
               setError(res);
            }
         });
      } else {
         return;
      }
   };

   return (
      <div className="crudApp">
         <h2>CRUD API</h2>
         <article className="grid-1-2">
            <CrudForm
               createData={createData}
               updateData={updateData}
               dataToEdit={dataToEdit}
               setDataToEdit={setDataToEdit}
            />

            {loading && <Loader />}
            {error && (
               <Menssaje
                  msg={`Error ${error.status}:${error.statusText}`}
                  bgColor="#dc3545"
               />
            )}

            {db && (
               <CrudTable
                  data={db}
                  setDataToEdit={setDataToEdit}
                  deleteData={deleteData}
               />
            )}
         </article>
      </div>
   );
};

export default CrudApi;
