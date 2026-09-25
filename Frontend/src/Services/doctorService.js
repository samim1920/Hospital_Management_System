import AxiosInterceptor from "../Interceptor/AxiosInterceptor";

const DoctorService = {

    // =====================================================
    // GET ALL DOCTORS
    // =====================================================

    getAllDoctors: async () => {

        const response = await AxiosInterceptor.get(
            "/doctor/all"
        );

        return response.data;
    },


    // =====================================================
    // GET DOCTOR BY ID
    // =====================================================

    getDoctorById: async (id) => {

        const response = await AxiosInterceptor.get(
            `/doctor/${id}`
        );

        return response.data;
    },


    // =====================================================
    // CREATE DOCTOR
    // =====================================================

    createDoctor: async (
        doctorData,
        profileImage,
        galleryImages
    ) => {

        const formData = new FormData();


        // -------------------------------------------------
        // Doctor JSON
        // -------------------------------------------------

        formData.append(
            "doctor",
            new Blob(
                [JSON.stringify(doctorData)],
                {
                    type: "application/json"
                }
            )
        );


        // -------------------------------------------------
        // Profile Image
        // -------------------------------------------------

        if (profileImage) {

            formData.append(
                "image",
                profileImage
            );
        }


        // -------------------------------------------------
        // Gallery Images
        // -------------------------------------------------

        if (
            galleryImages &&
            galleryImages.length > 0
        ) {

            galleryImages.forEach((file) => {

                if (file) {

                    formData.append(
                        "galleryImages",
                        file
                    );
                }

            });
        }


        // -------------------------------------------------
        // Send Request
        // -------------------------------------------------

        const response =
            await AxiosInterceptor.post(
                "/doctor/create",
                formData
            );

        return response.data;
    },


    // =====================================================
    // UPDATE DOCTOR
    // =====================================================

    updateDoctor: async (
        id,
        doctorData,
        profileImage,
        galleryImages
    ) => {

        const formData = new FormData();


        // -------------------------------------------------
        // Doctor JSON
        // -------------------------------------------------

        formData.append(
            "doctor",
            new Blob(
                [JSON.stringify(doctorData)],
                {
                    type: "application/json"
                }
            )
        );


        // -------------------------------------------------
        // New Profile Image
        // -------------------------------------------------

        if (profileImage) {

            formData.append(
                "image",
                profileImage
            );
        }


        // -------------------------------------------------
        // New Gallery Images
        // -------------------------------------------------

        if (
            galleryImages &&
            galleryImages.length > 0
        ) {

            galleryImages.forEach((file) => {

                if (file) {

                    formData.append(
                        "galleryImages",
                        file
                    );
                }

            });
        }


        // -------------------------------------------------
        // Send Request
        // -------------------------------------------------

        const response =
            await AxiosInterceptor.put(
                `/doctor/${id}`,
                formData
            );

        return response.data;
    },


    // =====================================================
    // DELETE DOCTOR
    // =====================================================

    deleteDoctor: async (id) => {

        const response =
            await AxiosInterceptor.delete(
                `/doctor/${id}`
            );

        return response.data;
    },


    // =====================================================
    // DELETE GALLERY IMAGE
    // =====================================================

    deleteGalleryImage: async (
        doctorId,
        galleryId
    ) => {

        const response =
            await AxiosInterceptor.delete(
                `/doctor/${doctorId}/gallery/${galleryId}`
            );

        return response.data;
    }

};

export default DoctorService;