import { TagModel } from '@/utils/types';
import { Formik, FieldArray, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { Button } from '@tremor/react';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { useAddTag, useEditTag } from '@/hooks/useTags';
import { toast } from '@/utils/toast';
import { useCallback } from 'react';

const schema = Yup.object().shape({
  name: Yup.string().required('Tag name is a required field'),
  type: Yup.string().required('Type is a required field'),
  aliases: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().nullable(),
        alias: Yup.string().required('Alias name cannot be empty'),
      })
    )
    .nullable(),
});

interface AddTagFormProps {
  tag?: TagModel;
  onCancel: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTagForm: React.FC<AddTagFormProps> = ({ tag, onCancel }) => {
  const addTag = useAddTag();
  const editTag = useEditTag();

  const initialValues = {
    id: tag?.id || '',
    name: tag?.name || '',
    type: tag?.type || '',
    aliases: tag?.aliases || [],
  };

  const closeForm = useCallback(() => onCancel(false), [onCancel]);

  return (
    <div>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={async (values) => {
          if (tag) {
            const result = await editTag({
              id: +values?.id,
              name: values?.name,
              type: values?.type,
              aliases: values?.aliases,
            });

            if ('success' === result.status) {
              toast.success('Tag edited!');
              closeForm();
            } else {
              toast.error('There was some error editing the tag.');
            }
          } else {
            const result = await addTag({
              name: values?.name,
              type: values?.type,
              aliases: values?.aliases,
            });

            if ('success' === result.status) {
              toast.success('Tag added!');
              closeForm();
            } else {
              toast.error('There was some error adding the tag.');
            }
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <div className="flex gap-4 w-full">
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tag name
                </label>
                <input
                  type="name"
                  name="name"
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Tag Name"
                  required
                />
                <p className="text-red-500 mt-1" role="alert">
                  {errors.name && touched.name && errors.name}
                </p>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Type
                </label>
                <input
                  type="type"
                  name="type"
                  id="type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.type}
                  placeholder="macro_stack"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                <p className="text-red-500 mt-1" role="alert">
                  {errors.type && touched.type && errors.type}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <FieldArray
                name="aliases"
                render={(arrayHelpers) => (
                  <div>
                    {values.aliases &&
                      values.aliases.length > 0 &&
                      values.aliases.map((aliasObj, index) => (
                        <div key={index} className="mt-4">
                          <div className="flex gap-4 items-center">
                            <label
                              htmlFor={`aliases.${index}`}
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Alias {index + 1}
                            </label>
                            <input
                              type="text"
                              name={`aliases.${index}.alias`}
                              id={`aliases.${index}`}
                              value={aliasObj.alias}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block flex-1 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder={`Alias ${index + 1}`}
                            />

                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                              className="focus:outline-none"
                            >
                              Remove
                            </button>
                          </div>
                          <div>
                            <p className="text-red-500 " role="alert">
                              {errors.aliases &&
                                typeof errors.aliases[index] === 'object' &&
                                touched.aliases &&
                                touched.aliases[index]?.alias &&
                                (
                                  errors.aliases[index] as
                                    | FormikErrors<{ alias: string }>
                                    | undefined
                                )?.alias}
                            </p>
                          </div>
                        </div>
                      ))}

                    <div className="flex justify-center">
                      <Button
                        className="focus:outline-none mt-4"
                        size="xs"
                        icon={PlusCircleIcon}
                        onClick={() =>
                          arrayHelpers.push({ id: undefined, alias: '' })
                        }
                        type="button"
                      >
                        Add an Alias
                      </Button>
                    </div>
                  </div>
                )}
              />
            </div>

            <hr className="mt-4" />

            <div className="mt-4">
              <Button
                data-testid="new-tag-button"
                size="xs"
                icon={PlusCircleIcon}
                type="submit"
              >
                {!tag ? 'Add new tag' : 'Edit tag'}
              </Button>
              <Button
                size="xs"
                variant="secondary"
                className="ml-3 -translate-y-[3px]"
                type="button"
                onClick={() => closeForm()}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddTagForm;
