import React, {useEffect, useState} from 'react';
import Panel from "@/Layouts/Admin/Panel";
import {Autocomplete, Checkbox, TextareaAutosize, TextField} from "@mui/material";
import {Editor} from "@tinymce/tinymce-react";

// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars

import tinymce from 'tinymce/tinymce';

// Theme
import 'tinymce/themes/silver/theme';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide-dark/skin.css';

//TinyMce plugings
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/help';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/autoresize';

//LANGUE DE TINYMCE

import "../../../lang/fr_FR"
import {minWidth} from "@mui/system";
import {useForm} from "@inertiajs/inertia-react";
import {indigo} from "@mui/material/colors";
import {styles} from "dom7";
import {Inertia} from "@inertiajs/inertia";
import Swal from "sweetalert2";

function Edit({auth,success,criteresSelections,criteresPreselections,secteurs,regions,errors,programme,selections,preselections,}) {

    const {data,setData}=useForm({
        "titre":programme.titre,
        "description":programme.description,
        "dateDebut":programme.dateDebut,
        "dateFin":programme.dateFin,
        "details":programme.details,
        "secteurs":programme.secteurs,
        "regions":programme.regions,
        "criteresPreselections":preselections?preselections:[],
        "criteresSelections":selections?selections:[],
        "image":"",
        "fichiersSupplementaires":[],
        "noteMinPreselection":programme.noteMinPreselection,
        "noteMinSelection":programme.noteMinSelection,
    })

    useEffect(()=>{
        console.log(errors)
    })

    useEffect(()=>{
        success && Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: success,
            showConfirmButton: false,
            timer: 2000
        })
    },[success,programme])


    function today()
    {
        var curr = new Date();
        curr.setDate(curr.getDate());
        var date = curr.toISOString().substr(0,10);
        return date
    }

    function example_image_upload_handler (blobInfo, success, failure, progress) {
        var xhr, formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', '/uploadImage');

        xhr.upload.onprogress = function (e) {
            progress(e.loaded / e.total * 100);
        };

        xhr.onload = function() {
            var json;

            if (xhr.status === 403) {
                failure('HTTP Error: ' + xhr.status, { remove: true });
                return;
            }
            if (xhr.status === 500) {
                failure('HTTP Error: ' + xhr.status, { remove: true });
                return;
            }

            if (xhr.status < 200 || xhr.status >= 300) {
                failure('HTTP Error: ' + xhr.status);
                return;
            }

            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.location != 'string') {
                failure('Invalid JSON: ' + xhr.responseText);
                return;
            }

            success(json.location);
        };

        xhr.onerror = function () {
            failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
        };

        formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());

        xhr.send(formData);
    }

    function handleEditorChange(content) {
        setData("details",content)
    }

    function handleSubmit(e) {

        e.preventDefault()
        Inertia.post(route("admin.programme.update",[auth.user.id,programme.id]),{
            _method:"put",
            programme:data
        })

    }


    function selectMultiple() {
        setData("fichiersSupplementaires",e.target.files)

    }

    return (
        <Panel
            auth={auth}
            success={success}
            active={"programme"}
            sousActive={"modificationProgramme"}
        >
            <div className={"justify-center flex p-5"}>
                <form onSubmit={handleSubmit} action="" className={"grid space-y-10 md:w-7/12 w-full"}>
                    <span className="text-2xl font-bold font">
                        Modification du programme
                    </span>
                    <div>
                        <TextField className={"w-full"} value={data.titre} onChange={e=>setData("titre",e.target.value)} label={"titre du programme"} variant={"standard"}/>
                        <div className={"text-red-600"}>{errors["programme.titre"]}</div>
                    </div>
                    <div className={"space-y-5"}>
                        <div>Description du programme</div>
                        <TextareaAutosize
                            value={data.description} onChange={e=>setData("description",e.target.value)}
                            aria-label="minimum height"
                            maxRows={4}
                            className={"w-full"} style={{height:100}} label={"description du programme"} variant={"standard"}/>
                        <div className={"text-red-600"}>{errors["programme.description"]}</div>
                    </div>

                    <div>
                        <TextField className={"w-full"} type={"date"} value={data.dateDebut} onChange={e=>setData("dateDebut",e.target.value)} variant={"standard"}/>
                        <div className={"text-red-600"}>{errors["programme.dateDebut"]}</div>
                    </div>

                    <div>
                        <TextField className={"w-full"}  value={data.dateFin} onChange={e=>setData("dateFin",e.target.value)} type="date" variant={"standard"}/>
                        <div className={"text-red-600"}>{errors["programme.dateFin"]}</div>
                    </div>

                    <div className={"grid md:grid-cols-2 grid-cols-1 gap-5 border-t py-2 w-full"} style={{maxWidth:1000}}>
                        <div className={"flex flex-col space-y-3"}>
                            <span className={"text-xl font-bold"}>Modifier l'image du programme</span>
                            <span>
                            Ajoutez une image qui représente clairement votre programme. Choisissez une image de banniere de preference.
                        </span>
                        </div>
                        <div>
                            <div className={"my-2"}>
                                {
                                    data.image ?
                                        <img className={"object-cover"} style={{maxHeight:200}} src={URL.createObjectURL(data.image)} alt=""/>
                                    :
                                        <img className={"object-cover"}  style={{maxHeight:200}} src={programme.image} alt=""/>
                                }
                            </div>

                            <TextField
                                className={"w-full"}
                                type={"file"} onChange={e=>setData("image",e.target.files[0])}
                            />
                            <div className={"text-red-600"}>{errors["programme.image"]}</div>
                        </div>
                    </div>

                    <div className={"space-y-10"}>
                        <div className={"text-xl font-bold"}>
                            Modification des critères
                        </div>
                        <div className={"flex flex-col space-y-2"}>
                            <div>
                                Selectionnez les secteurs concernés ( Laisser vide si tous les secteurs sont concernés)
                            </div>
                            <div>
                                <Autocomplete
                                    multiple
                                    id="tags-standard"
                                    onChange={(e,val)=>setData("secteurs",val)}
                                    disablePortal={true}
                                    id={"combo-box-demo"}
                                    value={data.secteurs}
                                    options={secteurs}
                                    getOptionLabel={option=>option.libelle}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params)=><TextField variant={"standard"} fullWidth {...params} placeholder={"Secteurs concernés"} label={params.libelle}/>}
                                />
                                <div className={"text-red-600"}>{errors["programme.secteurs"]}</div>
                            </div>
                        </div>

                        <div className={"flex flex-col space-y-1"}>
                            <div>
                                Selectionnez les regions concernées ( Laisser vide si toutes les regions sont concernées)
                            </div>
                            <div>
                                <Autocomplete
                                    multiple
                                    id="tags-standard"
                                    onChange={(e,val)=>setData("regions",val)}
                                    disablePortal={true}
                                    id={"combo-box-demo"}
                                    value={data.regions}
                                    options={regions}
                                    getOptionLabel={option=>option.libelle}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params)=><TextField variant={"standard"} fullWidth {...params} placeholder={"Regions concernées"} label={params.libelle}/>}
                                />
                                <div className={"text-red-600"}>{errors["programme.regions"]}</div>
                            </div>
                        </div>

                        <div className={"flex flex-col space-y-2"}>
                            <div>
                                Selectionnez les criteres de preselections
                            </div>
                            <div>
                                <Autocomplete
                                    multiple
                                    id="tags-standard"
                                    onChange={(e,val)=>setData("criteresPreselections",val)}
                                    disablePortal={true}
                                    id={"combo-box-demo"}
                                    value={data.criteresPreselections}
                                    options={criteresPreselections}
                                    getOptionLabel={option=>option.description+`${option.notemax ?" ("+option.notemax+")":""}`}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params)=><TextField variant={"standard"} fullWidth {...params} placeholder={"Critères de préselection"} label={params.description}/>}
                                />
                                <div className={"text-red-600"}>{errors["programme.criteresPreselections"]}</div>
                            </div>
                        </div>

                        <div className={"flex flex-col"}>
                            <div>
                                Entrez la note minimale de préselection
                            </div>
                            <div>
                                <TextField inputProps={{min:1,max: 100}} disabled={data.criteresPreselections.length === 0} value={data.noteMinPreselection} style={{maxWidth:300}} type={"number"} variant={"standard"} className={"w-full"} onChange={(e)=>setData('noteMinPreselection',e.target.value)} label={"note minimale de preselection"}/>
                                <div className={"text-red-600"}>{errors["programme.noteMinPreselection"]}</div>
                            </div>
                        </div>
                        <div className={"flex flex-col space-y-2"}>
                            <div>
                                Selectionnez les criteres de selections
                            </div>
                            <div>
                                <Autocomplete
                                    multiple
                                    id="tags-standard"
                                    onChange={(e,val)=>setData("criteresSelections",val)}
                                    disablePortal={true}
                                    id={"combo-box-demo"}
                                    value={data.criteresSelections}
                                    options={criteresSelections}
                                    getOptionLabel={option=>option.description+`${option.notemax ?" ("+option.notemax+")":""}`}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params)=><TextField variant={"standard"} fullWidth {...params} placeholder={"Critères de selection"} label={params.description}/>}
                                />
                                <div className={"text-red-600"}>{errors["programme.criteresSelections"]}</div>
                            </div>
                        </div>
                        <div className={"flex flex-col"}>
                            <div>
                                Entrez la note minimale de selection
                            </div>
                            <div>
                                <TextField inputProps={{min:1,max: 100}} disabled={data.criteresSelections.length === 0} value={data.noteMinSelection} style={{maxWidth:300}} type={"number"} variant={"standard"} className={"w-full"} onChange={(e)=>setData('noteMinSelection',e.target.value)} label={"note minimale de selection"}/>
                                <div className={"text-red-600"}>{errors["programme.noteMinSelection"]}</div>
                            </div>
                        </div>
                        <div>
                            <div>
                                Selectionnez les fichiers supplementaire à ajouter (pdf,word,excel)*
                            </div>
                            <input accept={".pdf,.xlsx,.xls,.docx"} className={"form-control custom-control mt-5"} id={"img"} type="file" multiple  onChange={selectMultiple} />

                        </div>

                    </div>
                    <div className={"space-y-5"}>
                        <div className={"font-bold"}>Details du programme</div>
                        <Editor
                            value={data.details} onEditorChange={handleEditorChange}
                            init={{
                                plugins: [
                                    'autoresize advlist autolink lists link image charmap print preview hr anchor pagebreak',
                                    'searchreplace wordcount visualblocks visualchars code fullscreen',
                                    'insertdatetime media nonbreaking save table directionality',
                                    'template paste textpattern imagetools codesample toc help image code'
                                ],
                                mobile: {
                                    menubar: true
                                },
                                skin: false,
                                content_css: false,
                                language:'fr_FR',
                                min_height:400,
                                toolbar: 'undo redo | formatselect | link image media | code ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                content_style: 'img {max-width: 600px;height:"auto";},body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                // enable title field in the Image dialog
                                image_title: true,
                                // enable automatic uploads of images represented by blob or data URIs
                                automatic_uploads: true,
                                media_live_embeds: true,
                                // add custom filepicker only to Image dialog
                                //images_upload_credentials: true,
                                paste_data_images: true,
                                paste_as_text: true,
                                convert_urls: false,
                                images_upload_url: "/uploadImage",
                                image_advtab: true,
                                images_upload_handler:example_image_upload_handler,
                                image_dimensions:false,
                            }}
                        >

                        </Editor>
                        <div className={"text-red-600"}>{errors["programme.details"]}</div>

                        <button type="submit" className={"border-2 border-indigo-600 text-indigo-600 hover:bg-blue-600 hover:text-white transition duration-500 rounded p-2"}>
                            Enregistrer
                        </button>
                    </div>
                </form>

            </div>

        </Panel>
    );
}

export default Edit;
