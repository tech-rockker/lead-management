import React from 'react'
import { FileText, Image } from 'react-feather'
import { Card, Col, Label, Row } from 'reactstrap'
import { FM, isValid } from '../../../../utility/helpers/common'
import { Severity, SpaceTrim } from '../../../../utility/Utils'
import DropZone from '../../../components/buttons/fileUploader'
import FormGroupCustom from '../../../components/formGroupCustom'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const DevDetails = ({
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  return (
    <>
      <div className='p-2'>
        <Row>
          <Col md='4'>
            <Card className='p-2 shadow rounded'>
              <div className='content-header mb-1'>
                <h5 className='mb-0'>{FM('add-description')}</h5>
                <small className='text-muted'>{FM('add-description-details')}</small>
              </div>
              <Row>
                <Col md='12'>
                  <FormGroupCustom
                    name={'description'}
                    label={FM('event-description')}
                    type={'autocomplete'}
                    errors={errors}
                    className='mb-2'
                    style={{ minHeight: 125 }}
                    id='event_with_id'
                    control={control}
                    rules={{
                      required: true,
                      validate: (v) => {
                        return isValid(v) ? !SpaceTrim(v) : true
                      }
                    }}
                    values={edit}
                  />
                </Col>
                <Col md='12'>
                  <FormGroupCustom
                    name={'immediate_action'}
                    label={FM('immediate-action')}
                    type={'autocomplete'}
                    errors={errors}
                    className='mb-2'
                    style={{ minHeight: 125 }}
                    id='immediate_with_id'
                    control={control}
                    rules={{
                      required: true,
                      validate: (v) => {
                        return isValid(v) ? !SpaceTrim(v) : true
                      }
                    }}
                    values={edit}
                  />
                </Col>
                <Col md='12'>
                  <FormGroupCustom
                    name={'probable_cause_of_the_incident'}
                    label={FM('probable-cause-of-the-incident')}
                    type={'autocomplete'}
                    style={{ minHeight: 125 }}
                    id='probable_with_id'
                    errors={errors}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>
                <Col md='12'>
                  <FormGroupCustom
                    name={'suggestion_to_prevent_event_again'}
                    label={FM('suggestions')}
                    type={'autocomplete'}
                    style={{ minHeight: 125 }}
                    id='seg_with_id'
                    errors={errors}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>
                <Col md='12'>
                  <FormGroupCustom
                    label={'severity'}
                    type={'select'}
                    isClearable
                    defaultOptions
                    control={control}
                    options={Severity()}
                    name={'critical_range'}
                    className='mb-2'
                    rules={{
                      required: true,
                      validate: (v) => {
                        return isValid(v) ? !SpaceTrim(v) : true
                      }
                    }}
                    values={edit}
                  />
                </Col>
                <Col md='12'>
                  <FormGroupCustom
                    name={'is_secret'}
                    label={FM('is-secret')}
                    type={'checkbox'}
                    errors={errors}
                    className='mt-2'
                    control={control}
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md='8'>
            <Card className='p-2 shadow rounded'>
              <div className='content-header mb-1'>
                <h5 className='mb-0'>{FM('related-factor')}</h5>
                <small className='text-muted'>{FM('click-to-preview')}</small>
              </div>
              <Row>
                <Col>
                  {watch('category_id') ? (
                    <>
                      <Zoom>
                        <img
                          name='related_factor'
                          src={
                            isValid(watch('subcat_image'))
                              ? watch('subcat_image')
                              : watch('cat_image')
                          }
                          className='img-fluid'
                        />
                      </Zoom>
                    </>
                  ) : null}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {/* <Card className='p-2 shadow rounded'>
                    <Row>
                        <Col md="6" >
                            <FormGroupCustom
                                label={"severity"}
                                type={"select"}
                                isClearable
                                defaultOptions
                                control={control}
                                options={Severity()}
                                name={"critical_range"}
                                className="mb-2"
                                rules={{ required: false }}
                                values={edit}
                            />
                        </Col>

                        <Col md="4">
                            <FormGroupCustom
                                name={"is_secret"}
                                label={FM("is-secret")}
                                type={"checkbox"}
                                errors={errors}
                                className="mt-2"
                                control={control}
                                rules={{ required: false }}
                                values={edit} />
                        </Col>
                    </Row>
                </Card> */}
      </div>
    </>
  )
}

export default DevDetails
