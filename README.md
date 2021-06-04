# Hiragata_ai

The AI model that is used in [hiragata.com](https://hiragata.com/).

## Dev guide

### I want to work with the data only (no model training)
1. Clone the repo
2. Change working directory to the repo root (`cd Hiragata_ai`)
3. 

Reguirements:
The hardware and software requirements are the same as regular tensorflow. You can use [this](https://www.tensorflow.org/install/gpu#hardware_requirements) quide to get deps working.
| Name | Version |
| ------------- | ------------- |
| [NVIDIA® GPU drivers](https://www.nvidia.com/Download/index.aspx?lang=en-us) | >410.x  |
| [CUDA® Toolkit](https://developer.nvidia.com/cuda-10.0-download-archive)  | 10.0  |
| [cuDNN SDK](https://developer.nvidia.com/rdp/cudnn-download)  | >=7.4.1 but not 8 |

Install packages only after ^
If you get C build errors on windows consult [tfjs doc](https://github.com/tensorflow/tfjs/blob/master/tfjs-node/WINDOWS_TROUBLESHOOTING.md#msbuildexe-exceptions)
 
if you get gpu allocation err try running
`export TF_FORCE_GPU_ALLOW_GROWTH=true`

## Data

The source data is under `data/source`
The model-ready data can be found from [Google Drive](https://drive.google.com/drive/folders/1VZO4YAlFP1xegt1BvoKUMDOY_9Nm3p-b?usp=sharing)
