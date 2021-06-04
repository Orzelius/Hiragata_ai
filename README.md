# Hiragata_ai

The AI model that is used in [hiragata.com](https://hiragata.com/).

## Dev guide

### I want to work with the data only (no model training)
1. Clone the repo
2. Change working directory to the repo root (`cd Hiragata_ai`)
3. Download some model-ready data from [Google Drive](https://drive.google.com/file/d/13nL7qlIiph2Ok4lOz5mcxD5KC__8jozf/view?usp=sharing)
4. Extract data to `data/bin/` (Final result should be something like `data/bin/48x48/binary_files_located_here`)
5. Install npm packages `npm ci` (It's fine if tfjs build fails as you won't need it if you're only working with data. Most of tfjs will still work as it will fallback to the js version if you don't have the GPU stuff working)
6. Create dir for test-images `mkdir test-images`
7. Run `npm run init-data` to create some images into `/test-images` and test if everything works
8. Great success!

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
